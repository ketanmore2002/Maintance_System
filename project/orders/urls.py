from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from orders import views



urlpatterns = [ path("",views.index,name='index'),
                path("tickets/",views.tickets ,name='tickets'),
                path("temp_login/",views.temp_login,name='temp_login'),
                path("form/",views.form,name='form'),
                path("admin_panal/",views.admin_panal,name='admin_panal'),
                path("getfile/",views.getfile,name='getfile'),

                path("data_all/",views.data_all,name='data_all'),
                path("data_count/",views.data_count,name='data_count'),
                path("data_incomplete/",views.data_incomplete,name='data_incomplete'),
                path("update_data/",views.update_data,name='update_data'),
                path("update_data_2/",views.update_data_2,name='update_data_2'),
                path("delete_data/<int:id>/",views.delete_data,name='delete_data'),
                path("fetch_data_id/<int:id>/",views.fetch_data_id,name='fetch_data_id'),
                path("data_by_number/<int:x>/",views.data_by_number,name='data_by_number'),
                path("data_change/",views.data_change,name='data_change'),
                path("logout/",views.logOut, name='logout'),

                
                path("statistics/",views.statistics, name='statistics'),
                # path("getfile/",views.getfile,name='getfile'),

              ]