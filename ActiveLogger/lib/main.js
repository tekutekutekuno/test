//tekunoExtension2turbo
//tokuno tatsuya
//出力info タブ固有の番号、そのブラウザでのタブの位置、activate、そのページがアクティブになった時間、別のページに移動したorアクティブじゃなくなった時間、そのページのタイトル、そのページのURLをCSV形式で出力


// Import the APIs we need.
var contextMenu = require("context-menu");
var request = require("request");
var selection = require("selection"); 
const {Cc,Ci,Cu} = require("chrome");
var tabs = require("tabs");

//初期
exports.main = function(options, callbacks) {
    console.log(options.loadReason);

	dd = new Date();
    	hh = dd.getHours();
    	mi = dd.getMinutes();
    	ss = dd.getSeconds();
    	yy = dd.getYear();
    	mm = dd.getMonth() + 1;
    	da = dd.getDate();
    	if (yy < 2000) { yy += 1900; }
    	if (mm < 10) { mm = "0" + mm; }
    	if (da < 10) { da = "0" + da; }
    	date = yy + "/" + mm + "/" + da + " " + hh + ":" + mi + ":" + ss;
	
	for (i=0; i<tabs.length;i++){
	tabs[i].number = i;//タブ固有の番号
    tabs[i].flag1 =0;//Openと同時のReadyかどうかのflag 1ならOpenと同時。0ならOpenとは別のReady。
    }
    
    //初期化
    j=tabs.length;
    
    activetime = date;
    activetitle = tabs[0].title;
    activetab = tabs[0].url;
    oldoutput = null;
    
    savepath = "/tmp/"+ yy + mm + da +".log"    
    fName = ""+yy + mm + da +".log";
    Addonfile(fName);
    //console.log(savepath);
    }
   
   
   // アドオンフォルダ直下のパスを手に入れるのだ
   function Addonfile(fName){
   const id = "jid1-vQj6uZaWAevulA@jetpack";
   try{
    var AddonManager = Cu.import("resource://gre/modules/AddonManager.jsm").AddonManager; 
    AddonManager.getAddonByID(id, function(addon) {
    var savefile = addon.getResourceURI(fName).QueryInterface(Ci.nsIFileURL).file;
    savepath = savefile.path;
    });
    }catch(e){
    var ext = Cc["@mozilla.org/extensions/manager;1"]
        .getService(Ci.nsIExtensionManager)
        .getInstallLocation(id)
        .getItemLocation(id);
    var savefile = ext.clone();               
    savefile.append(fName);
    savepath = savefile.path;
    }
   };
    


    // Listen for tab openings & loads.
tabs.on('open', function onOpen(tab) {
tab.flag1 = 1;
	tab.on('ready', function onReady(tab){    
        if(tab.number == undefined){//タブナンバーが設定されていない場合セットする
        tab.number = j;//タブ固有の番号（ブラウザを全て閉じるまでリセットされないみたい
        j++;
        }
        
    if(tabs.activeTab.number == tab.number){// そのオープンがアクティブなタブでのオープンかどうか
        activetab = tab.url;
        activetitle =tab.title;
        activetime = date;
    }
        
    });
});


    // Listen for tab content loads.
    tabs.on('ready', function onReady (tab) {
    if(tab.flag1 == 0){
        dd = new Date();
    	hh = dd.getHours();
    	mi = dd.getMinutes();
    	ss = dd.getSeconds();
    	yy = dd.getYear();
    	mm = dd.getMonth() + 1;
    	da = dd.getDate();
    	if (yy < 2000) { yy += 1900; }
    	if (mm < 10) { mm = "0" + mm; }
    	if (da < 10) { da = "0" + da; }
    	date = yy + "/" + mm + "/" + da + " " + hh + ":" + mi + ":" + ss;
        
    if(tabs.activeTab.number == tab.number){//その読み込みがアクティブなタブでの読み込みかどうか
    info ='"'+ tab.number+'","'+ tab.index +'",'+'"active",' + '"'+activetime+'","'+ date +'","'+ activetitle +'","'+ activetab+'"' + "\n";
    
	//console.log(info);
	writefile(savepath,info);
    
    activetab = tab.url;
	activetitle =tab.title;
	activetime = date;
    oldoutput = info;
    }
    }
    tab.flag1 = 0;
});

  // Listen for tab content closed.
    tabs.on('close', function onClose (tab) {
        dd = new Date();
    	hh = dd.getHours();
    	mi = dd.getMinutes();
    	ss = dd.getSeconds();
    	yy = dd.getYear();
    	mm = dd.getMonth() + 1;
    	da = dd.getDate();
    	if (yy < 2000) { yy += 1900; }
    	if (mm < 10) { mm = "0" + mm; }
    	if (da < 10) { da = "0" + da; }
    	date = yy + "/" + mm + "/" + da + " " + hh + ":" + mi + ":" + ss;
        
        if(tabs.activeTab.number == tab.number){//アクティブなタブを閉じたのかどうか  
            info ='"'+ tab.number+'","'+ tab.index +'",'+'"active",' + '"'+activetime+'","'+ date +'","'+ activetitle +'","'+ activetab+'"' + "\n";
    
        if(info != oldoutput){
      //  console.log(info);
        writefile(savepath,info);
        oldoutput = info;
        }
    }
});



  // Listen for tab content activated.
    tabs.on('activate', function onActivate (tab) {
        dd = new Date();
    	hh = dd.getHours();
    	mi = dd.getMinutes();
    	ss = dd.getSeconds();
    	yy = dd.getYear();
    	mm = dd.getMonth() + 1;
    	da = dd.getDate();
    	if (yy < 2000) { yy += 1900; }
    	if (mm < 10) { mm = "0" + mm; }
    	if (da < 10) { da = "0" + da; }
    	date = yy + "/" + mm + "/" + da + " " + hh + ":" + mi + ":" + ss;
        
        if(tab.number == undefined){
        tab.number = j;//タブ固有の番号（ブラウザを全て閉じるまでリセットされないみたい
        j++;
        }
    activetab = tab.url;
	activetitle =tab.title;
	activetime = date;
 });

// Listen for tab content deactivated.
    tabs.on('deactivate', function onDeactivate (tab) {
        dd = new Date();
    	hh = dd.getHours();
    	mi = dd.getMinutes();
    	ss = dd.getSeconds();
    	yy = dd.getYear();
    	mm = dd.getMonth() + 1;
    	da = dd.getDate();
    	if (yy < 2000) { yy += 1900; }
    	if (mm < 10) { mm = "0" + mm; }
    	if (da < 10) { da = "0" + da; }
    	date = yy + "/" + mm + "/" + da + " " + hh + ":" + mi + ":" + ss;
        
    info ='"'+ tab.number+'","'+ tab.index +'",'+'"active",' + '"'+activetime+'","'+ date +'","'+ activetitle +'","'+ activetab+'"' + "\n";
    
	if(info != oldoutput){
        //console.log(info);
        writefile(savepath,info);
        oldoutput = info;
        }
});



    //filePathの場所にcontentを追加出力する関数
   function writefile(filePath,content){
         try {
           //netscape.security.PrivilegeManager.enablePrivilege ('UniversalXPConnect');
           var file = Cc["@mozilla.org/file/local;1"].createInstance (Ci.nsILocalFile);
           file.initWithPath (filePath);
           if (! file.exists ()) file.create (0, 0664);
           var out = Cc["@mozilla.org/network/file-output-stream;1"].createInstance (Ci.nsIFileOutputStream);
           out.init (file, 0x02 | 0x10 , 0004, null);
             var charset = "UTF-8";
           var conv = Cc["\@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream);
           conv.init(out, charset, 0, 0x0000);
           conv.writeString(content);
           conv.close(); 
  }catch (e) {
           throw e;
          }
    };
