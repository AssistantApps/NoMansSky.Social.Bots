$version = '0.16'


docker build -t nms-social-npc-bots -f Dockerfile .


# ----------------------- Tag and push to remote -----------------------
docker tag nms-social-npc-bots registry.local.khaoznet.xyz/nms-social-npc-bots:$version
docker push registry.local.khaoznet.xyz/nms-social-npc-bots:$version

