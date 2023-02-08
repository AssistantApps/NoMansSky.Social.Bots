$version = '0.10'

# npm ci
# npm run build
# npm run copy-assets
# npm run copy-env

docker build -t nms-social-npc-bots -f Dockerfile .


# ------------------------- Tags -------------------------
docker tag nms-social-npc-bots registry.local.khaoznet.xyz/nms-social-npc-bots:$version

# ------------------------- Push -------------------------
docker push registry.local.khaoznet.xyz/nms-social-npc-bots:$version


PAUSE