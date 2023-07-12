var xml=new XMLHttpRequest();
xml.open('GET','bin/list.xml',false);
xml.send();
var xmlData=xml.responseXML;
var lopp = NaN;
xmlData=(new DOMParser()).parseFromString(xml.responseText,'text/xml');
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
    $("#chck1").prop("checked",DefaultValues.center);
    $("#chck2").prop("checked",DefaultValues.align);    
    $("#chck3").prop("checked",DefaultValues.title[0]);
    $("#texttile").val(DefaultValues.title[1]);


    load();
    if($(this).val() != 'next'){
        for (let i = 0; i <= (pages[$(this).val()].list.length - 1); i++) {
            $("#cont"+pages[$(this).val()].list[i]).prop("checked",true);
        }
    }
    load();
});


function copyToClipboard() {
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

function getall(){
    var array = [];
    $("input:checkbox[name='p']:checked").each(function() {
        array.push($(document).find(this).val());
    });
    return array;
} 
function encyt(text) {  
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

    if($('#chck1').is(':checked')){
        $('.col').css('justify-content', 'center');
    }else{
        $('.col').css('justify-content', 'normal');
    }

    if($('#chck2').is(':checked')){
        $('.col').css('align-items','center');
    }else{
        $('.col').css('align-items','normal');
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

function load(ids=false){  
    
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

            var chck = '';
            var flx = '';
            if(getall().includes(Id)){
                chck = 'checked';
                flx = 'style="flex: 0 0 auto;"';
            }
            txt += `
            <div class="cont" `+ flx +`>  
                <div class="til">
                    <h1>`+ Id +`</h1>
                </div>
                <div class="pd" style="min-width: `+ valueW +`cm;width: auto;height:`+ valueH +`cm;">
                    <div class="line"></div>
                    <input id="cont`+Id+`" type="checkbox" value="`+Id+`" name="p" onchange="load()" `+chck+`>
                </div>
                <div class="selected">
                    <label for="cont`+Id+`"></label>
                    <i class="fa-solid fa-check"></i>        
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
        'center':$('#chck1').is(":checked"),
        'align':$('#chck2').is(":checked"),
        'title':[$('#chck3').is(":checked"),$('#texttile').val()],
        'mg':mg,       
        'depa':namesDepas(),
        'format':'Flex',
        'w':$('#width').val(),
        'h':$('#height').val()
    }
    var Json = {
        'start':start,
        'end':max,
        'list':getall()
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
    $("input:checkbox[name='p']:checked").each(function() {
        label = $(document).find(this).parent().parent().find('.selected label');
        $(label).css({
            'background-color': 'black',
            'opacity': '0.2'
        });
        label.parent().find('i').css('display','block');
    });
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
        'list':getall()
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
function stepper(btn){
    console.log($('.grid').css('grid-template-rows').split(" ").length, $('.grid').css('grid-template-columns').split(" ").length);

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
    clearInterval(lopp);
    load();
    lopp = setInterval(stepper, 100,btn)
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
    $("#chck1").prop("checked",false);
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