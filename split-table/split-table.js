var $_st_dsContainer = $("div[data-split='container']");
$_st_dsContainer.addClass('_hjq_split-container');

var $_st_dsContainers = [];
var params = []; //参数信息
$_st_dsContainer.each(function(i){
	$_st_dsContainers[i] = $(this);
});

/////////////
function _null2Str(str){
	if(str==null||str=='null') return "";
	return str;
}
function _st_initData(indexNum){
	var _st_tbodyHtmlStr = '';
	for(var i = 0;i < params[indexNum]._st_dataJson.length;i++){
		var tempStr = params[indexNum]._st_dataHtmlStr;
		var dataObj = params[indexNum]._st_dataJson[i];
		for(var key in dataObj){
			tempStr = tempStr.replace(eval("/\\$"+key+"\\$/g"),_null2Str(dataObj[key]));
		}
		tempStr = tempStr.replace("$_st_index$",(params[indexNum]._st_nowPaper-1)*params[indexNum]._st_pageShowNum+i+1);
		_st_tbodyHtmlStr += tempStr;
	}
	$_st_dsContainers[indexNum].find('tbody').html(_st_tbodyHtmlStr);
}
function _st_initPaper(indexNum,_st_nowPaper,_st_pageCount){
	var syBtn = ' <button class="_split-btn _hjq_sy_btn" onclick="_st_changePaper('+indexNum+',1)">首页</button> ';//首页按钮
	var syyBtn = '<button class="_split-btn _hjq_syy_btn" onclick="_st_changePaper('+indexNum+','+(params[indexNum]._st_nowPaper-1)+')">上一页</button> ';//上一页按钮
	var xyyBtn = '<button class="_split-btn _hjq_xyy_btn" onclick="_st_changePaper('+indexNum+','+(params[indexNum]._st_nowPaper+1)+')">下一页</button> ';//下一页按钮
	var wyBtn = '<button class="_split-btn _hjq_wy_btn" onclick="_st_changePaper('+indexNum+','+params[indexNum]._st_pageCount+')">尾页</button> ';//尾页按钮
	var paperStr = '<div class="_split_btn_group">\
		<span>显示条数</span>\
		<select class="_hjq_showCount" onchange="_st_dsContainer('+indexNum+')">\
			<option value="5">5</option>\
			<option value="10">10</option>\
			<option value="20">20</option>\
		</select>'+syBtn+syyBtn+xyyBtn+wyBtn+'\
		<input type="text" class="_hjq_ty_input" />\
		<button class="_split-btn" onclick="_st_tyPaper('+indexNum+')">跳页</button>\
		<button class="_split-btn" onclick="_st_init('+indexNum+')">刷新</button>\
		<span>当前在第<b>'+params[indexNum]._st_nowPaper+'</b>页,总页<b>'+params[indexNum]._st_pageCount+'</b>页</span>\
	</div>';
	$_st_dsContainers[indexNum].find('._split_btn_group').remove();
	$_st_dsContainers[indexNum].append(paperStr);
	$_st_dsContainers[indexNum].find("._hjq_showCount").val(params[indexNum]._st_pageShowNum);
	if(_st_nowPaper == 1){
		$_st_dsContainers[indexNum].find("._hjq_sy_btn,._hjq_syy_btn").attr("disabled",true).css("background","#AAA");
	}
	if(_st_nowPaper == _st_pageCount){
		$_st_dsContainers[indexNum].find("._hjq_xyy_btn,._hjq_wy_btn").attr("disabled",true).css("background","#AAA");
	}
}

function _st_dsContainer(indexNum){
	params[indexNum]._st_pageShowNum = parseInt($_st_dsContainers[indexNum].find("._hjq_showCount").val());
	params[indexNum]._st_nowPaper = 1;
	_st_init(indexNum);
}

function _st_init(indexNum){
	var wheres = getWhere(indexNum);
	var tj = JSON.stringify(wheres);
	if(wheres.length == 0) tj = '';
	$.get(params[indexNum]._st_dataUrl,{
		page: params[indexNum]._st_nowPaper,
		rows: params[indexNum]._st_pageShowNum,
		tj: tj
	},function(data){
		var dataObj = $.parseJSON(data);
		params[indexNum]._st_totalCount = dataObj.records;
		params[indexNum]._st_pageCount =  Math.ceil(params[indexNum]._st_totalCount/params[indexNum]._st_pageShowNum);
		params[indexNum]._st_dataJson = dataObj.rows;
		_st_initPaper(indexNum,params[indexNum]._st_nowPaper,params[indexNum]._st_pageCount);
		_st_initData(indexNum);
		
	});
}
function exportExcel(indexNum,data){
	var wheres = getWhere(indexNum);
	var tj = JSON.stringify(wheres);
	if(wheres.length == 0) tj = '';
	window.location.href=params[indexNum]._st_excelUrl+'&page='+params[indexNum]._st_nowPaper
		+'&rows='+params[indexNum]._st_pageShowNum+'&tj='+tj+'&exportExcel='+data;
}

function _st_tyPaper(indexNum){
	var _st_pageShowNumTemp = $_st_dsContainers[indexNum].find('._hjq_ty_input').val();
	if(_st_pageShowNumTemp == '' || _st_pageShowNumTemp < '1' || _st_pageShowNumTemp > params[indexNum]._st_pageCount) return;
	_st_changePaper(indexNum,_st_pageShowNumTemp);
}
function _st_changePaper(indexNum,_st_pageShowNumTemp){
	if(_st_pageShowNumTemp <= 0 || _st_pageShowNumTemp > params[indexNum]._st_pageCount){
		return;
	}
	params[indexNum]._st_nowPaper = _st_pageShowNumTemp;
	_st_init(indexNum);
}
/////////////

function getWhere(indexNum){
	var wheres = [];
	$_st_dsContainers[indexNum].find('input[data-split="tj"],select[data-split="tj"]').each(function(i){
		var name = $(this).attr("data-split-search-name");
		var op = $(this).attr("data-split-search-op");
		var value = $(this).val();
		var where = {
			name:name,
			op:op,
			value:value
		}
		if(value != null && value != ''){
			wheres.push(where);			
		}
	});
	return wheres;
}


$_st_dsContainer.each(function(i){
	var $_st_tbody = $(this).find("tbody");
	var _st_dataHtmlStr = $_st_tbody.html();
	var _st_dataJson = [];
	var _st_dataUrl = $(this).attr('data-split-url');
	var _st_excelUrl = $(this).attr('data-split-excel-url');
	var _st_totalCount = 0; //总记录数
	var _st_nowPaper = 1; //当前页
	var _st_pageShowNum = 5; //每页显示条数
	var _st_pageCount = 0; //总共多少页
	
	param = {
		_st_dataHtmlStr:_st_dataHtmlStr,
		_st_dataJson: _st_dataJson,
		_st_dataUrl: _st_dataUrl,
		_st_totalCount:_st_totalCount,
		_st_nowPaper:_st_nowPaper,
		_st_pageShowNum:_st_pageShowNum,
		_st_pageCount:_st_pageCount,
		_st_excelUrl: _st_excelUrl
	}
	params[i] = param;
	
	$(this).find('button[data-split-search="btn"]').click(function(e){
		params[i]._st_nowPaper = 1;
		_st_init(i);
	});
	$(this).find('button[data-split-excel="btn"]').click(function(e){
		var data = $_st_dsContainers[i].find('div[data-split-excel="data"]').text();
		if($.trim(data) == null || $.trim(data) == '') return;
		exportExcel(i,data);
	});
	
	_st_init(i);
});
