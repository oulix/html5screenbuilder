<%@ LANGUAGE="VBSCRIPT" CODEPAGE="936" %> 
<!--#include file="config.asp"-->
<!--#include file="Uploader.Class.asp"-->
<!--#include file="json.asp"-->

<%
    'Author: techird
    'Date: 2013/09/29

    '����
    'MAX_SIZE �������趨��֮��������ִ��ϴ�ʧ�ܣ���ִ�����²���
    'IIS 6 
        '�ҵ�λ�� C:\Windows\System32\Inetsrv �е� metabase.XML �򿪣��ҵ�ASPMaxRequestEntityAllowed �����޸�Ϊ��Ҫ��ֵ����10240000��10M��
    'IIS 7
        '��IIS����̨��ѡ�� ASP����������������һ�����������ʵ���������ơ���������Ҫ��ֵ

    Dim up, json, path, allowPaths

    allowPaths = config.Item("imageSavePath")
    If Request.QueryString("fetch") <> "" Then
        Response.AddHeader "Content-Type", "text/html;charset=gbk"
        Response.Write "updateSavePath(" + toJson(allowPaths) + ");"
        Response.End
    End If

    Set up = new Uploader
    up.MaxSize = 10 * 1024 * 1024
    up.AllowType = Array(".gif", ".png", ".jpg", ".jpeg", ".bmp")
    up.ProcessForm()

    path = up.FormValues.Item("dir")
    If( IsEmpty(path) ) Then 
        path = allowPaths(0)
    ElseIf IsInArray(allowPaths, path) = False Then
        Response.Write("{ 'state' : '�Ƿ��ϴ�Ŀ¼��' }")
        Response.End
    End If
    up.FileField = "upfile"
    up.SavePath = path + "/"
    up.SaveFile()

    Session.CodePage = 936
    Response.AddHeader "Content-Type", "text/html;charset=gbk"
    SetLocale 2052

    Set json = jsObject()
    json("url") = up.FilePath
    json("original") = up.OriginalFileName
    json("state") = up.State
    json("title") = Server.HTMLEncode(up.FormValues.Item("pictitle"))

    Response.Write json.jsString()

    Function IsInArray(arr, elem)
        IsInArray = false
        For Each i In arr
            If i = elem Then IsInArray = true
        Next
    End Function
%>