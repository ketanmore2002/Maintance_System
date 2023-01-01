from django.shortcuts import render

from .models import *

from django.http import JsonResponse ,HttpResponse

from django.core import serializers

from django.contrib.admin.views.decorators import staff_member_required

from django.contrib.auth.decorators import login_required


from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from django.conf import settings # Here
from django.contrib.auth.models import User

# Create your views here.



def index (request):
    # ticket_Orders.objects.all().delete()
    # print(dir(settings.AUTH_USER_MODEL))
    return render (request , 'index.html')

def temp_login(request):
    if request.user.is_authenticated:
        return redirect("/")
    else:
        return render(request , 'login_temp.html')

@login_required()
def form(request):

    if request.method == 'POST':

        user_name = request.POST.get('user_name', None)

        user_id = request.POST.get('user_id', None)

        fname = request.POST.get('fname', None)

        lname = request.POST.get('lname', None)
 
        email = request.POST.get('email', None)
 
        Phone_Number = request.POST.get('Phone_Number', None)
 

        Address = request.POST.get('Address', None)
 
        Product_Name= request.POST.get('Product_Name', None)
        comment= request.POST.get('comment', None)

        
        ticket_Orders.objects.create(user_name=user_name,user_id=user_id,fname=fname,lname=lname,email=email,Phone_Number=Phone_Number,Address=Address,Product_Name=Product_Name,comment=comment)

        # subject = 'Ticket Raised Successfully'
        # html_message = render_to_string('mail.html', {'user_name': fname +" "+lname})
        # plain_message = strip_tags(html_message)
        # from_email = 'From <from@example.com>'
        # to = email
        # mail.send_mail(subject, plain_message, from_email, [to], html_message=html_message)


        return redirect("/tickets")

 
    return render(request , 'form.html')


@staff_member_required
def admin_panal(request):
    engg_username = request.user.id
    data=ticket_Orders.objects.filter(engg_username=engg_username)[::-1]
    percentage = (ticket_Orders.objects.filter(status="Completed",engg_username=engg_username).count()/ticket_Orders.objects.all().count())*100
    percentage = round(percentage, 1)
    incomplete = (ticket_Orders.objects.filter(status="Submitted",engg_username=engg_username).count()+ticket_Orders.objects.filter(status="Processing").count())
    total = ticket_Orders.objects.filter(engg_username=engg_username).count()
    progress = ticket_Orders.objects.filter(status="Processing",engg_username=engg_username).count()
    return render(request , 'admin.html',{"data":data, "total": total, "percentage":percentage, "incomplete":incomplete, "progress":progress})


def statistics(request):
    engg_username = request.user.id
    percentage = (ticket_Orders.objects.filter(status="Completed",engg_username=engg_username).count()/ticket_Orders.objects.all().count())*100
    percentage = round(percentage, 1)
    incomplete = (ticket_Orders.objects.filter(status="Submitted",engg_username=engg_username).count()+ticket_Orders.objects.filter(status="Processing").count())
    total = ticket_Orders.objects.filter(engg_username=engg_username).count()
    progress = ticket_Orders.objects.filter(status="Processing",engg_username=engg_username).count()

    data = {
        "percentage" : percentage,
        "incomplete" : incomplete,
        "total": total,
        "progress": progress
    }

    # return HttpResponse()
    return JsonResponse(data)



import csv
@staff_member_required
def getfile(request):
    engg_username = request.user.id
    response = HttpResponse(content_type='text/csv')  
    response['Content-Disposition'] = 'attachment; filename="docs.csv"'  
    orders_db = ticket_Orders.objects.filter(engg_username=engg_username)  
    writer = csv.writer(response)  
    for order in orders_db:  
        writer.writerow([order.date,order.fname,order.lname,order.email,order.Phone_Number,order.Product_Name,order.Address,order.comment,order.status])  
    return response 

@staff_member_required
def data_all (request):  
    engg_username = request.user.id
    data = ticket_Orders.objects.filter(engg_username=engg_username)
    qs_json = serializers.serialize('json', data)
    return HttpResponse(qs_json, content_type='application/json')

@staff_member_required
def data_count (request):
    engg_username = request.user.id
    data = ticket_Orders.objects.filter(engg_username=engg_username).count()
    # qs_json = serializers.serialize('json', data)
    # data = {"count" : data}
    # return HttpResponse(data, content_type='application/json')
    return HttpResponse(data)

@staff_member_required
def data_incomplete (request) :
    engg_username = request.user.id
    data = ticket_Orders.objects.all().filter(status="incomplete",engg_username=engg_username)
    qs_json = serializers.serialize('json', data)
    return HttpResponse(qs_json, content_type='application/json')

@staff_member_required
def update_data (request):
    if request.method == 'POST':
        engg_username = request.user.id
        id = request.POST.get('id', None)
        status = request.POST.get('status', None)
        csrfmiddlewaretoken = request.POST.get('csrfmiddlewaretoken', None)
        ticket_Orders.objects.filter(id=id,engg_username=engg_username).update(status = status)

        
        # x =  ticket_Orders.objects.filter(id=id).update(status = status)
        
        # subject = 'Ticket status Changed'
        # html_message = render_to_string('mail.html', {'user_name': x[0].fname +" "+x[0].lname , "status":status})
        # plain_message = strip_tags(html_message)
        # from_email = 'From <from@example.com>'
        # to = x[0].email
        # mail.send_mail(subject, plain_message, from_email, [to], html_message=html_message)

        # print(1)

        return HttpResponse("Agreement Successfully Updated!!!!")
    else :
        return HttpResponse("Post request not yet recieved!")


@staff_member_required
def update_data_2 (request):
    if request.method == 'POST':
        engg_username = request.user.id
        id = request.POST.get('id', None)
        answer = request.POST.get('solution', None)
        csrfmiddlewaretoken = request.POST.get('csrfmiddlewaretoken', None)
        ticket_Orders.objects.filter(id=id,engg_username=engg_username).update(answer = answer)
        return HttpResponse("Success")
    

@staff_member_required
def delete_data (request, id):
    # if request.method == 'POST':
    #     id = request.POST.get('id', None)
    engg_username = request.user.id
    ticket_Orders.objects.filter(id=id,engg_username=engg_username).delete()
        
    return HttpResponse("Agreement Successfully Deleted!!!!")
    # else :
    #     return HttpResponse("Post request not yet recieved!")

@staff_member_required
def fetch_data_id (request,id):
    engg_username = request.user.id
    data = ticket_Orders.objects.filter(id=id,engg_username=engg_username)
    # data = page.objects.all()
    qs_json = serializers.serialize('json', data)
    return HttpResponse(qs_json, content_type='application/json')

@staff_member_required
def data_by_number (request,x):
    engg_username = request.user.id
    data = ticket_Orders.objects.filter(engg_username=engg_username)[::-1][:x]
    # data = page.objects.all()
    qs_json = serializers.serialize('json', data)
    return HttpResponse(qs_json, content_type='application/json')


@staff_member_required
def data_change(request):
    if request.method == 'POST':
        engg_username = request.user.id
        id = request.POST.get('id', None)
        x = request.POST.get('status', None)   
        ticket_Orders.objects.filter(id=id,engg_username=engg_username).update(status=x)


        # y =  ticket_Orders.objects.filter(id=id,engg_username=engg_username)
        
        # subject = 'Ticket status Changed'
        # html_message = render_to_string('mail2.html', {'user_name': y[0].fname +" "+y[0].lname , "status":x})
        # plain_message = strip_tags(html_message)
        # from_email = 'From <from@example.com>'
        # to = y[0].email
        # mail.send_mail(subject, plain_message, from_email, [to], html_message=html_message)

        return HttpResponse("Successfully !")


@login_required()
def tickets (request):
    data = ticket_Orders.objects.filter(user_id=request.user.id,user_name=request.user.username)[::-1]
    
    return render(request, 'myTickets.html', {"data": data})

from django.contrib.auth import logout
from django.shortcuts import redirect

@login_required()
def logOut(request):
    logout(request)
    return redirect('index')