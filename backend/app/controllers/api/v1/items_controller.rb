class Api::V1::ItemsController < ApplicationController
  def index
    valid_access_token

    items = [
      { id: 1, name: "Secret item1" },
      { id: 2, name: "Secret item2" },
    ]
    render json: items
  end

  private

  def valid_access_token
    # Cognitoの情報を設定
    region = ENV["COGNITO_REGION"]
    user_pool_id = ENV["COGNITO_USER_POOL_ID"]
    cognito_jwks_url = "https://cognito-idp.#{region}.amazonaws.com/#{user_pool_id}/.well-known/jwks.json"
    expected_issuer = "https://cognito-idp.#{region}.amazonaws.com/#{user_pool_id}"

    # CognitoからJWKセットを取得
    response = Net::HTTP.get_response(URI.parse(cognito_jwks_url))
    jwks = JSON.parse(response.body)

    # JWTをデコード
    jwt_string = request.headers["Authorization"].split(" ")[1]
    jwt = JSON::JWT.decode(jwt_string, :skip_verification)

    # 適切なJWKを見つける
    jwk = jwks['keys'].find { |key| key['kid'] == jwt.header['kid'] }

    if jwk
      jwk_json = JSON::JWK.new(jwk)

      # JWTを検証し、期限切れや正しいイシュアーによる発行を確認
      begin
        verified_jwt = JSON::JWT.decode(jwt_string, jwk_json.to_key)

        # 期限切れのトークンをチェック
        current_time = Time.current.to_i
        if verified_jwt['exp'] && current_time > verified_jwt['exp']
          raise "Access token is expired"
        elsif verified_jwt['iss'] != expected_issuer
          # イシュアーをチェック
          raise "Invalid issuer"
        else
          # "JWT is valid"
        end
      rescue JSON::JWT::VerificationFailed
        raise "JWT verification failed"
      end
    else
      raise "JWK not found"
    end
  end
end
