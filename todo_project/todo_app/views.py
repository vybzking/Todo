from django.views import ListView, DetailView, CreateView, UpdateView, DeleteView, reverse_lazy
from .models import GeneralObjectives

def add_main_obj(request):
    if request.method == "POST":
         main_obj_form = MainObjForm(request.POST)