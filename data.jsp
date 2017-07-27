<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String pageNumber = request.getParameter("page");//显示第几页
	String rows = request.getParameter("rows"); //每页显示多少条
	
	out.clear();
	out.print("{\"records\":\"12\""
		+",\"rows\":[{\"workcode\":\"00\",\"lastname\":\"小明0\",\"birth_date\":\"1995-12-12\"}"
		+",{\"workcode\":\"11\",\"lastname\":\"小明1\",\"birth_date\":\"1995-12-12\"}"
		+",{\"workcode\":\"22\",\"lastname\":\"小明2\",\"birth_date\":\"1995-12-12\"}"
		+",{\"workcode\":\"33\",\"lastname\":\"小明3\",\"birth_date\":\"1995-12-12\"}"
		+",{\"workcode\":\"44\",\"lastname\":\"小明4\",\"birth_date\":\"1995-12-12\"}]}");
%>
