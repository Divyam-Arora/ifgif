# Generated by Django 3.1.5 on 2021-03-13 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0004_auto_20210313_2035'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='owner_info',
            field=models.JSONField(default={'data': 'unavailable'}),
        ),
    ]
