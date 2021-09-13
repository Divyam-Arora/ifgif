from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, UpdateView, DeleteView, ListView, DetailView
from .models import Content, Tag, TagsRef, Trending_tag
import json
# Create your views here.

class Home(View):
    template_name = 'home/home.html'
    def get(self,request):
        gifs = Content.objects.filter(status='COM')
        trends = Trending_tag.objects.all().order_by('id')[:6]
        ctx = {'gifs':gifs, 'trends':trends}
        return render(request,self.template_name,ctx)

class upload(LoginRequiredMixin, CreateView):
    template_name = 'home/gif_form.html'
    model = Content
    fields = ['media']
    success_url = str()

    def form_valid(self, form):
        print('form_valid called')
        object = form.save(commit=False)
        object.owner = self.request.user
        def dumper(obj):
            try:
                return obj.toJSON()
            except:
                return obj.__dict__
        object.owner_info = json.dumps(self.request.headers, default=dumper, indent=2)
        object.save()
        self.success_url = reverse('home:upload_tags', args=[object.id])
        return super(upload, self).form_valid(form)

class uploadTags(LoginRequiredMixin, View):
    template_name = 'home/tag_form.html'

    def get(self, request, pk):
        content = get_object_or_404(Content, id=pk, owner=request.user)
        ctx = {'content':content}
        return render(request,self.template_name,ctx)

    def post(self, request, pk):
        content = get_object_or_404(Content, id=pk)
        print(request.POST['tags'])
        for tag in request.POST['tags'][:-1].split(';'):
            try:
                tag = Tag.objects.get(name=tag)
                tr = TagsRef(tag=tag, content=content)
                tr.save()
                tag.content_count += 1
                tag.save()
                content.status = 'COM'
                content.save()
            except:
                tag = Tag(name=tag)
                tag.save()
                tr = TagsRef(tag=tag,content=content)
                tr.save()
                tag.content_count += 1
                tag.save()
                content.status = 'COM'
                content.save()

        return HttpResponse()

class search(View):
    def get(self, request, count, tg):
        if tg==" ":
            content = Content.objects.filter(status="COM").values("id",'media')[count:count+15]
            data = []
            for cont in content:
                print(cont)
                data.append(cont)
            ctx = data
            print(ctx)
        else:
            tags = Tag.objects.none()
            content_set = set()
            prev_content_set = set()
            content_count = 0
            for tag in tg.split():
                tags = Tag.objects.filter(name__startswith=tag)
                for tag in tags:
                    content_set_len = len(content_set)
                    content = tag.content.all().values_list("id", flat=True)[:count+15]
                    prev_content_set.update(content)
                    content_count = len(prev_content_set)
                    if content_count > count:
                        start_index = 0
                        end_index = 15 - content_set_len
                        print(tag,content,start_index,end_index,content_set_len)
                        content_set.update(content[start_index:end_index])
                        if content_set_len >= count+15:
                            break
                    print(content_set)
            data = []
            if len(content_set) == 0 and count == 0:
                content = Content.objects.get(id=62)
                data.append({"id":content.id,"owner":str(content.owner),"media":str(content.media)})
            for cont in content_set:
                print(cont)
                content = Content.objects.get(id=cont)
                print(content.tag_set.all().values_list("name",flat=True))
                data.append({"id":content.id,"media":str(content.media)})
            ctx = data
            print(ctx)
        return JsonResponse(ctx,safe=False)

class view(View):
    def get(self,request,pk):
        content = Content.objects.get(id=pk)
        ctx = ({"id":content.id,"owner":str(content.owner),"tags":list(content.tag_set.all().values_list("name",flat=True)),"date":content.created_at})
        return JsonResponse(ctx,safe=False)
