from home.models import Content, Tag, Trending_tag
import os
import shutil
def run():
    gifs = Content.objects.filter(status = 'DEL')
    path = os.path.abspath("images")
    for gif in list(gifs.values("media")):
        shutil.rmtree(os.path.join(path,gif["media"][:-10]))
    gifs.delete()
