from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Content)
admin.site.register(Tag)
admin.site.register(TagsRef)
admin.site.register(Trending_tag)
