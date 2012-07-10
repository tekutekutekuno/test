//source bin/activate
//cfx run
//出力info タブ固有の番号、そのブラウザでのタブの位置、stay、そのページにアクセスした時間、別のページに移動した時間、そのページのタイトル、そのページのURLをCSV形式で出力
//出力info2 タブ固有の番号、そのブラウザでのタブの位置、open(close)、そのページを開いた(閉じた)時間、そのページのタイトル、そのページのURLをCSV形式で出力


// Import the APIs we need.
var contextMenu = require("context-menu");
var request = require("request");
var selection = require("selection"); 
const {Cc,Ci,Cu} = require("chrome");
var tabs = require("tabs");

//初期
exports.main = function(options, callbacks) {
    console.log(options.loadReason);
 
	oldtab = new Array();
	oldtime = new Array();
	oldtitle = new Array();

	j=tabs.length;


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
	tabs[i].number = i;
	oldtime[i]=date;
	tabs[i].flag=0;//flagはonOpenが発生したかどうかを判断。1なら発生。
	tabs[i].flag2=0;//flag2はReadyイベントがopenを伴っているかどうかを判断。1なら伴っている。
	}
    

    savepath = "/tmp/"+ yy + mm + da +".log"    
//    fName = ""+yy + mm + da +".log";
//    Addonfile(fName);
    //console.log(fName);
}
   
   
   
/*   function Addonfile(fName){
   const id = "jid1-gL5mGK7dqRn85w@jetpack";
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
*/    

    // Listen for tab openings & loads.
tabs.on('open', function onOpen(tab) {
	tab.flag=1;//flagはonOpenが発生したかどうかを判断。1なら発生。
	tab.flag2=1;//flag2はReadyイベントがopenを伴っているかどうかを判断。1なら伴っている。
	tab.on('ready', function onReady(tab){
    if(tab.flag==1){
        tab.flag=0;
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
        
        tab.number = j;//タブ固有の番号（ブラウザを全て閉じるまでリセットされないみたい
        j++;
	
        oldtab[tab.number] = tab.url;
        oldtitle[tab.number] = tab.title;
        oldtime[tab.number] = date;
        info2 ='"'+ tab.number+'","' + tab.index+'",' +'"open",'+ '"'+date+'"," ","' + oldtitle[tab.number]+'","'+ oldtab[tab.number]+'"'+"\n";
	
        //console.log(info2);
        writefile(savepath,info2);
    }

    //tab.flag4=0;
    });
});
    // Listen for tab content loads.
    tabs.on('ready', function onReady (tab) {
    if(tab.flag2==0 ){
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
		info ='"'+ tab.number+'","'+ tab.index +'",'+'"stay",' + '"'+oldtime[tab.number]+'","'+ date +'","'+ oldtitle[tab.number] +'","'+ oldtab[tab.number]+'"' + "\n";


        if(oldtitle[tab.number] != undefined){
        writefile(savepath,info);	
        //console.log(info);
        }

	oldtab[tab.number] = tab.url;
	oldtitle[tab.number] =tab.title;
	oldtime[tab.number] = date;
	}
    tab.flag2=0;
	
});


    // Listen for tab closes.
    tabs.on('close', function onClose(tab) {
	
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

	
	info ='"'+ tab.number+'","'+ tab.index +'",'+'"stay",' + '"'+oldtime[tab.number]+'","'+ date +'","'+ oldtitle[tab.number] +'","'+ oldtab[tab.number]+'"' + "\n";
	//console.log(info);
	writefile(savepath,info);

	info2 ='"'+ tab.number+'","' + tab.index+'",' +'"close",'+ '" ","'+date+'","' + oldtitle[tab.number]+'","'+ oldtab[tab.number]+'"'+"\n";

	//console.log(info2);
	writefile(savepath,info2);
});
   


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
