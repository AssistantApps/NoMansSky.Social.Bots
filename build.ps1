$json = Get-Content './package.json' | Out-String | ConvertFrom-Json

$version = $json."version"

# Write-Output $version

docker build --no-cache -t nms-social-npc-bots -f Dockerfile --build-arg BUILD_VERSION=$version .


# ----------------------- Tag and push to remote -----------------------
docker tag nms-social-npc-bots registry.local.khaoznet.xyz/nms-social-npc-bots:$version
docker tag nms-social-npc-bots registry.local.khaoznet.xyz/nms-social-npc-bots:latest

docker push registry.local.khaoznet.xyz/nms-social-npc-bots:$version
docker push registry.local.khaoznet.xyz/nms-social-npc-bots:latest

