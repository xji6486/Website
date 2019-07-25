(function($){   // 封裝起來, 以免和外界js 變數衝突到
    $.fn.extend({
        //plugin name - animatemenu    // 定義 plugin 名稱
        ukagaka: function(options) {
            //Settings list and the default values   // 設定plugin input parameters 的預設值
            var defaults = {
                //googleKey: '0ArRwmWo93u-mdG93a2dkSWxIbHEzZjRIeDdxZXdsU1E',
                //googleFormkey: '1xADUIiBq1ksH7lxwSch1Nz_p2gSxdJttmv5OJOxJye0',
                //googleSheet: "od6",
                //googleSheetField: "entry.2030600456",
                //talkTime: 10000
                googleKey: '1icPg3iso1Ghu4Vaa2yu60VLDhRBPklZZtVdmbchwPh8',
                googleFormkey: '1FAIpQLSddB-jmWKT33mwdPBFDMWtbV0bVuRlJJzH4t5UxCy-8h87Q4A',
                googleSheet: "ov4iadt",
                googleSheetField: "entry.2005709834",
                talkTime: 5000
            };
           
            // 把預設值和實際輸入值比對, 如果有傳入值的則以傳入值為主
            // 如此便得到輸入值 options (在此匿名函式中存在之變數)
            var options = $.extend(defaults, options);
            // 執行此 plugin 的實際動作, 對其作用對象的陣列迭代(iterate over), 例如說對$(".class_name") 呼叫此plugin, 則 this.each 就代表所有帶有 class_name 為 class 屬性的DOM element
            return this.each(function() {
                var o = options;
               
                //Assign current element to variable, in this case is UL element
                var obj = $(this);         // obj 代表迭代到的單一物件
                var key = o.googleKey;
                var sheet = o.googleSheet;
                var formkey = o.googleFormkey;
                var sheetfield = o.googleSheetField;    
                var talking = [];
                var innerSettingHTML = "";
                innerSettingHTML += "<div id='ukagaka_img'></div>";
                innerSettingHTML += "<div class='ukagaka_box'>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_msgbox'>歡迎光臨 神的領域</div>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_menubox' style='display:none'>使用選單功能&#65292;僕は大丈夫だ<br/><br/><span id='ukagaka_menu_btn_addstring'>$ 學習</span><span id='ukagaka_menu_btn_renewlist'>$ 日誌</span><span id='ukagaka_menu_btn_exit'>$ 結束</span></div>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_stringinput' style='display:none'>請輸入讓神秘角色欲學的句子<br/><br/><input id='ukagaka_addstring' type='text'/><span id='ukagaka_addmenu_add'>$ 增加</span><span id='ukagaka_btn_menu'>$ 取消</span></div>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_renewlist' style='display:none'>更新日誌<br/><br/>大神 修正<br/><br/>找尋 AI 系統<br/>找尋 AI 對話<br/><br/><span id='ukagaka_btn_menu'>$ 取消</span></div>";
                innerSettingHTML += "<input id='ukagaka_sheetfield' type='hidden' value='" + sheetfield + "'>";
                innerSettingHTML += "</div>";
                obj.html(innerSettingHTML);  
                var footerMenuHTML = "";
                footerMenuHTML += "<div id='ukagaka_controlpanel'>";
                footerMenuHTML += "<span id='ukagaka_btn_display'>Display</span> ";
                footerMenuHTML += "<span id='ukagaka_btn_menu'>Menu</span>";
                footerMenuHTML += "</div>";
                obj.after(footerMenuHTML);
                function reloadtalking(){
                    /* JSON / load string from database */
                    $.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json", function(JData){
                        for (var i = 0; i < JData.feed.entry.length; i++) {
                            talking[i] = JData.feed.entry[i].gsx$storedatabase.$t;
                            // console.log("talk stmt : " + talking[i]);
                        }
                        $('input#ukagaka_addstring').attr('placeholder', '目前神秘角色學會了' + JData.feed.entry.length + '個字彙'); 
                    });
                };
                $(window).load(function(){   
                    var talk_timer = setInterval(talkingbox, o.talkTime);
                    function talkingbox() {    
                        if($("#ukagaka_msgbox").css("display") != 'none')
                        $("#ukagaka_msgbox").fadeOut(500, function(){
                            $(this).html(talking[Math.floor(Math.random() * talking.length)]).fadeIn(500)});
                    }
                });
                reloadtalking();    
                obj.draggable();
                $(document).on('click', "span#ukagaka_btn_display", function(event) {
                    $("#ukagaka_panel").fadeToggle(1000);
                 });
                $(document).on('click', "span#ukagaka_menu_btn_exit", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_msgbox").delay(500).fadeIn(500);
                 });
                $(document).on('click',"span#ukagaka_btn_menu", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_menubox").delay(500).fadeIn(500);
                 });
                $(document).on('click',"span#ukagaka_menu_btn_addstring", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_stringinput").delay(500).fadeIn(500);
                });
                $(document).on('click',"span#ukagaka_menu_btn_renewlist", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_renewlist").delay(500).fadeIn(500);
                });
                $(document).on('click',"span#ukagaka_addmenu_add", function(event) {
                    var add = $("input#ukagaka_addstring").val();
                    var googleSheetField = $('input#ukagaka_sheetfield').val();
                    var sendData = {};
                    sendData[googleSheetField] = add;
                    if(!((add.length <= 1) || add.indexOf('script') > -1|| add.indexOf('body') > -1 ||
                          add.indexOf('style') > -1 || add.indexOf('link') > -1 || add.indexOf('iframe') > -1 || add.indexOf('head') > -1 ||
                          add.indexOf('nav')>-1||add.indexOf('object')>-1||add.indexOf('embed')>-1)){
                        $.ajax({
                            type: 'POST',
                            url: 'https://docs.google.com/forms/d/' + formkey + '/formResponse',
                            data: sendData,
                            dataType: "xml",
                            statusCode: {
                                0: function() {
                                    $("input#ukagaka_addstring").attr("value","");
                                    $(".ukagaka_box div").fadeOut(500);
                                    $("#ukagaka_msgbox").fadeOut(500, function(){
                                        $(this).html("神秘角色學習了 !").fadeIn(1000)});
                                },
                                200: function() {
                                    $("input#ukagaka_addstring").attr("value","");
                                    $(".ukagaka_box div").fadeOut(500);
                                    $("#ukagaka_msgbox").fadeOut(500, function(){
                                        $(this).html("神秘角色學習了 !").fadeIn(1000)});
                                }
                            }
                        });
                    } else {
                        alert("馬鹿野郎！神秘角色不接受這個字串！");
                    }
                });
            });
        }
    });
})(jQuery);