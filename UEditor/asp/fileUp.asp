<%@ LANGUAGE="VBSCRIPT" CODEPAGE="936" %> 
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

    Dim up, json

    Set up = new Uploader
    up.MaxSize = 100 * 1024 * 1024
    up.AllowType = Array(".rar" , ".doc" , ".docx" , ".zip" , ".pdf" , ".txt" , ".swf" , ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".mov", ".wmv", ".mp4", ".webm")
    up.SavePath = "upload/"
    up.FileField = "upfile"
    up.UploadForm()

    Session.CodePage = 936
    Response.AddHeader "Content-Type", "text/html;charset=gbk"
    SetLocale 2052

    Set json = jsObject()
    json("url") = up.FilePath
    json("original") = up.OriginalFileName
    json("state") = up.State
    json("fileType") = up.FileType

    Response.Write json.jsString()
%>