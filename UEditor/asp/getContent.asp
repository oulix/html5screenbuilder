<% @LANGUAGE="VBSCRIPT" CODEPAGE="936" %> 
<meta http-equiv="Content-Type" content="text/html;charset=gbk"/>
<script src="../ueditor.parse.js" type="text/javascript"></script>
<script>
   uParse('.content',{
            'rootPath': '../'
   })

</script>
<%
	Dim content
	content = Request.Form("myEditor")
	Response.Write("第1个编辑器的值")
	Response.Write("<div class='content'>" + content + "</div>")
%>