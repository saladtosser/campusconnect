"""
ASGI config for campus_connect project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_connect.settings')

application = get_asgi_application() 