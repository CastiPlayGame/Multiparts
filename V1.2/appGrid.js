var xml=new XMLHttpRequest();
xml.open('GET','bin/list.xml',false);
xml.send();
var xmlData=xml.responseXML;
var lopp = NaN;
xmlData=(new DOMParser()).parseFromString(xml.responseText,'text/xml');
const gridAreaSize = 2.5;
var pd = null;
var n_rows = null;
var dp= $(xmlData).find('Departament');
var mg = 1.5;
var pages = Array();
var mode = 0;
var maxitems = 0;
var DefaultValues = NaN;

$(document).ready(function () {
    var txt = ''
    $(dp).each(function (i,element) {
        txt += `<div class="Chck1">
            <input type="checkbox" name="Depa" id="Dep`+i+`" value="`+i+`">
            <label for="Dep`+i+`">`+$(element).attr('name')+`</label>
        </div>`;
    });        
    $('#DepaCont').html(txt);
    $("input:checkbox[name='Depa']").eq(0).prop('checked', true);
    pd = dp.eq(0).find('Product');
    n_rows = pd.length;
    maxitems = n_rows;

    $('#S').attr('max',n_rows + 1);
    $('#E').attr('max',n_rows + 1);
});

$( "#DepaCont" ).on( "change", function() {
    n_rows = 0;    
    $("input:checkbox[name='Depa']:checked").each(function (i, e) {
        pd = dp.eq($(e).val()).find('Product');
        n_rows += pd.length;
    });
    maxitems = n_rows;
    $('#S').attr('max',n_rows + 1);
    $('#E').attr('max',n_rows + 1);
    load();
});

$( "input:radio[name='Options']" ).on( "change", function() {
    if($(this).attr('id') == 'radioMultiple'){
        if($('#PagesCont').val() != 'next'|| $('#PagesCont').val() != ''){
            $('.multiple').css('display', 'inline');
            $('#del').css('display', 'none');
        }else{
            $('#add_edit').text('Editar')        
            $('#del').css('display', 'inline');
        }
        mode = 1;        
        load();

    }
    if($(this).attr('id') == 'radioSingle'){
        $('.multiple').css('display', 'none');
        mode = 0;        
        load();

    }
});

$( "#PagesCont" ).on( "change", function() {     
    var loadconf;
    if($(this).val() != 'next'){
        $('#add_edit').text('Editar')        
        $('#del').css('display', 'inline');
        loadconf = pages[$(this).val()];
        $('#E').val(parseInt(loadconf.end)+1);
        $('#S').val(parseInt(loadconf.start)+1);
        $('#E').attr('value',parseInt(loadconf.end)+1);
        $('#S').attr('value',parseInt(loadconf.start)+1);
    }else{
        $('#add_edit').text('Agregar')        
        $('#del').css('display', 'none');
        loadconf = pages[pages.length - 1];
        $('#E').val(parseInt(loadconf.end)+1);
        $('#S').val(parseInt(loadconf.start)+1);        
        $('#E').attr('value',parseInt(loadconf.end)+1);
        $('#S').attr('value',parseInt(loadconf.start)+1);   
        empytVar();

    }
    $('#width').val(DefaultValues.w);
    $('#height').val(DefaultValues.h);
    $("#chck2").prop("checked",DefaultValues.align);    
    $("#chck3").prop("checked",DefaultValues.title[0]);
    $("#texttile").val(DefaultValues.title[1]);


    load();
    if($(this).val() != 'next'){
        Object.keys(loadconf.list).forEach(key => {
            var pd = $('#pd'+key);        
            pd.css('grid-row-start','span '+loadconf.list[key][1]);    
            pd.css('grid-column-start','span '+loadconf.list[key][0]);
            pd.find('.selected label').css('opacity', '0.2');
            pd.find('.selected i').css('display','block');
            pd.attr('class','cont Active');
          });
    }
    load();
});

function SetVals(i) {
    $('#Col').val($(i).parent().parent().css('grid-column-start').split(' ')[1]);
    $('#Col').attr('value',$(i).parent().parent().css('grid-column-start').split(' ')[1]);
    $('#Col').attr('min',$(i).parent().parent().attr('Cmin'));
    $('#Row').val($(i).parent().parent().css('grid-row-start').split(' ')[1]);
    $('#Row').attr('value',$(i).parent().parent().css('grid-row-start').split(' ')[1]);
    $('#Row').attr('min',$(i).parent().parent().attr('Rmin'));

}

function copyToClipboard(){
    load();
    var max = ($('#E').val() - 1);
    if(max <= 0 || $('#width').val() <= 0 || $('#height').val() <= 0 ){
        return;
    }    
    var $temp = $("<input>")
    $("body").append($temp);
    $temp.val($('#code').val()).select();
    document.execCommand("copy");
    $temp.remove();
}

function encyt(text){  
    var encodedStringBtoA = btoa(text);
    return(encodedStringBtoA);
}

function settings(){
    $('.col').css({
        'width': ($('#width').val() - mg)+'cm',
        'height': ($('#height').val()- mg)+'cm',
        'padding': mg+'cm'

    });
    $('.rows').css('height', Math.round($('#height').val() / 1.75)+'cm');
    $('.img').css({
        'width': ($('#width').val() - mg)+'cm',
        'height': ($('#height').val()- mg)+'cm'
    });
    if($('#chck2').is(':checked')){
        $('.grid').css('align-content','center');
    }else{
        $('.grid').css('align-content','normal');
    }
    if($('#chck3').is(':checked')){
        til($('#texttile'));
        $('#title').css('display', 'block');
        $('.ContInp.texttile').css('display', 'block');
        $('.grid').css('margin-top', '0.5cm');
    }else{
        $('#title').css('display', 'none');
        $('.ContInp.texttile').css('display', 'none');
        $('.grid').css('margin-top', '0');
    }
}

function til(i){
    var today = new Date();
    let text = i.val();
    if(text.includes("Year")){
        text = text.replace("Year", today.getFullYear());
    }
    if(text.includes("NextY")){
        text = text.replace("NextY", (today.getFullYear() + 1));
    }
    $('#title').html(text);
}

function GETDECISION(w,h){
    var txt = ['',''];
    var colCOnt = gridAreaSize;
    var rowCOnt = gridAreaSize;

    for (let i = 1; i < 50; i++) { 
        if(w < colCOnt){
            txt[0] = i; 
            break;
        }
        colCOnt = colCOnt+gridAreaSize;
    }
    for (let i = 1; i <= 50; i++) { 
        if(h < rowCOnt){
            txt[1] = i; 
            break;
        }
        rowCOnt = rowCOnt+gridAreaSize;
    }
    return txt;
}

function getallModifys(){
    var array = {};
    $(".cont.Active").each(function() {
        array[$(this).attr('id').substring(2)] = [$(this).css('grid-column-start').split(' ')[1],$(this).css('grid-row-start').split(' ')[1]]
    });
    return array;
}


function load(ids=false){    
    var lists = getallModifys()
    var start = ($('#S').val() - 1);
    var max = ($('#E').val() - 1);        
    var items = 0;        
    var txt = "";        
    if(max <= 0 || $('#width').val() <= 0 || $('#height').val() <= 0 ){
        return;
    }        
    settings();
    $("input:checkbox[name='Depa']:checked").each(function (i, e) {
        
        pd = dp.eq($(e).val()).find('Product');
        n_rows = pd.length;

        if(max > maxitems){ max = maxitems;}if(start > maxitems){ start = maxitems;}    

        for (let i = start; i < n_rows; i++) {        

            if(items >= (max - start)){
                break;
            }
            var Id= pd[i].getElementsByTagName('Id')[0].firstChild.data;
            var valueH= pd[i].getElementsByTagName('valueH')[0].firstChild.data;
            var valueW= pd[i].getElementsByTagName('valueW')[0].firstChild.data;
            var flx = GETDECISION(valueW,valueH);
            var confs = [flx[0],flx[1],'cont','',''];
            if(lists.hasOwnProperty(Id)){
                confs[0] = lists[Id][0];
                confs[1] = lists[Id][1];
                confs[2] = 'cont Active'
                confs[3] = 'opacity: 0.2'
                confs[4] = 'display: block'
            }
            txt += `
            <div id="pd`+Id+`" Cmin="`+flx[0]+`" Rmin="`+flx[1]+`" class="`+confs[2]+`" style="grid-column-start: span `+ confs[0] +`;grid-row-start: span `+ confs[1] +`">  
                <div class="til">
                    <h1>`+ Id +`</h1>
                    <input onchange="SetVals(this)" id="cont`+Id+`" type="radio" value="`+Id+`" name='GetDecision'>
                </div>
                <div class="selected">
                    <label for="cont`+Id+`" style="`+confs[3]+`"></label>
                    <i class="fa-solid fa-check" style="`+confs[4]+`"></i>        
                </div>
            </div>`;
            items++;
        }
    });        

    function namesDepas(){
        var array = [];
        $("input:checkbox[name='Depa']:checked").each(function(i,e) {
            array.push(dp.eq($(e).val()).attr('name'));
        });
        return array;
    }


    DefaultValues = {
        'align':$('#chck2').is(":checked"),
        'title':[$('#chck3').is(":checked"),$('#texttile').val()],
        'mg':mg,       
        'depa':namesDepas(),
        'format':'Grid',
        'gridAreaSize':gridAreaSize,
        'w':$('#width').val(),
        'h':$('#height').val()
    }
    var Json = {
        'start':start,
        'end':maxitems,
        'list':lists
    }


    $('.grid').html(txt);
    if(mode == 1){
        var selec = $('#PagesCont').val();
        $('#PagesCont').html(getpages());  
        $("#PagesCont option").attr("selected", false);      
        $("#PagesCont option[value='"+selec+"']").attr("selected", true); 
        $('#code').val(encyt(JSON.stringify(DefaultValues)+'__&SEPARATE&___Multiple__&SEPARATE&___'+JSON.stringify(pages)));
    }else{
        $('#code').val(encyt(JSON.stringify(DefaultValues)+'__&SEPARATE&___Only__&SEPARATE&___'+JSON.stringify(Json)));
    }


}
function eliminar(ids=false){
    if(ids != false){
        pages.splice(ids,1);        
        load();
        return;
    }
    if(pages.length == 1){        
        pages.splice($('#PagesCont').val(),1);        
        var loadconf = pages[pages.length - 1];        
        $('#E').val('1');
        $('#S').val('2');        
        empytVar();
        load();
    }
    if(pages.length > 1){        
        pages.splice($('#PagesCont').val(),1);       
        var loadconf = pages[pages.length - 1];        
        $('#E').val(parseInt(loadconf.end)+1);
        $('#S').val(parseInt(loadconf.start)+1);        
        empytVar();
        load();
    }
}
function add(){
    var startInp = ($('#S').val() - 1);
    var max = ($('#E').val() - 1);
    if(max > n_rows){ max = n_rows;}
    if(startInp > n_rows){ startInp = n_rows;}    
    var Json = {
        'start':startInp,
        'end':max,
        'list':getallModifys()
    }
    if(max <= 0 || $('#width').val() <= 0 || $('#height').val() <= 0 ){
        return;
    }    
    if($('#PagesCont').val() == 'next'|| $('#PagesCont').val() == ''){
        pages.push(Json);    
        empytVar();
    }else{
        if(pages[$('#PagesCont').val()].start != max && pages.length > 1){
            if(max >= pages[parseInt($('#PagesCont').val()) + 1].end){
                eliminar(parseInt($('#PagesCont').val()) + 1);
            }else{
                pages[parseInt($('#PagesCont').val()) + 1].start = max;
            }
        }
        pages[$('#PagesCont').val()] = Json
    }
    load();
}
function stepper(btn,op=false){
    let myInput = $(btn).parent().find(':input[type="number"]');
    let id = $(btn).attr("id");
    let min = myInput.attr("min");
    let max = myInput.attr("max");
    let step = myInput.attr("step");
    let val = myInput.attr("value");
    let calcval = (id == 'add') ? (step*1):(step*-1);
    let newVal =  parseInt(val) + calcval;
    if(newVal > max){ newVal = max; }else if(newVal < min){ newVal = min; }
    myInput.attr("value",newVal);
    myInput.val(newVal);

    if(op == true){
        console.log('Hola');
        isRowOrCol(myInput.attr("id"));
    }else{
        clearInterval(lopp);
        load();
        lopp = setInterval(stepper, 100,btn)
    }

}
function getpages(){
    txt = '<option value="" selected hidden>Cambia Pagina</option>';
    for (let i = 0; i <= pages.length - 1; i++) {
        txt += `<option value="`+i+`">Pagina `+(i+1)+`</option>`;     
    }
    txt += `<option value="next">Siguiente Pagina</option>`;
    return txt;
}
function empytVar(){
    $('.grid').html('');      
    $("#chck2").prop("checked",false);
    $("#chck3").prop("checked",false);

    if($('#E').val() >= n_rows || $('#S').val() >= n_rows){
        $('#S').val(n_rows);
        $('#E').val(n_rows);
    }else{
        $('#S').val($('#E').val());
        $('#E').val(parseInt($('#E').val()) + 1);
    }

}
function setval(inp){
    $(inp).attr("value",$(inp).val());
}

function isRowOrCol(i){
    var pd = $('#pd'+$("input[name='GetDecision']:checked").val());        
    pd.css('grid-row-start','span '+$('#Row').val());    
    pd.css('grid-column-start','span '+$('#Col').val());

    if(pd.attr('Rmin') != $('#Row').val() || pd.attr('Cmin') != $('#Col').val()){
        pd.find('.selected label').css('opacity', '0.2');
        pd.find('.selected i').css('display','block');
        pd.attr('class','cont Active');
    }else if(pd.attr('Rmin') == $('#Row').val() || pd.attr('Cmin') == $('#Col').val()){        
        pd.find('.selected label').css('opacity', '0');
        pd.find('.selected i').css('display','none');
        pd.attr('class','cont');
    }
}