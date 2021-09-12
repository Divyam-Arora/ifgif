from django.db import models
from django.conf import settings
import uuid
# Create your models here.

class Content(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
        path = str(uuid.uuid4())
        return '{0}/{1}'.format(path, 'ifgif.gif')
    media = models.ImageField(upload_to=user_directory_path)

    DELETED = 'DEL'
    COMPLETED = 'COM'
    PENDING = 'PEN'
    STATUS_CHOICES = [
        (DELETED,'Deleted'),
        (COMPLETED,'Completed'),
        (PENDING,'Pending'),
    ]
    status = models.CharField(
        max_length=3,
        choices=STATUS_CHOICES,
        default=DELETED,
    )

    owner_info = models.JSONField(default=dict(data="unavailable"))

    def __str__(self):
        return "id-"+str(self.id)+" by "+self.owner.username

class Tag(models.Model):
    name = models.CharField(max_length=50,null=False,blank=False)
    content_count = models.PositiveBigIntegerField(default=0)
    search_count = models.PositiveBigIntegerField(default=0)
    content = models.ManyToManyField(Content, through='TagsRef', through_fields=('tag','content'))

    def __str__(self):
        return self.name

class TagsRef(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    content = models.ForeignKey(Content, on_delete=models.CASCADE)

    def __str__(self):
        return "content_id-"+str(self.content.id)+" tag-"+self.tag.name

class Trending_tag(models.Model):
    tag = models.OneToOneField(Tag, on_delete=models.CASCADE)

    def __str__(self):
        return self.tag.name
