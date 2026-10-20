(function(){
  var KEY='cam_apps_v1';
  var seed=[
    {id:'CA2027-0001',name:'Ananya Rao',course:'B.Tech Computer Science',marks:'91.2',cat:'General',status:'Approved'},
    {id:'CA2027-0002',name:'Rahul Verma',course:'BBA',marks:'68.5',cat:'OBC',status:'Pending'},
    {id:'CA2027-0003',name:'Meera Nair',course:'B.Sc Physics',marks:'57.0',cat:'General',status:'Rejected'},
    {id:'CA2027-0004',name:'Imran Khan',course:'B.Pharm',marks:'72.8',cat:'General',status:'Pending'},
    {id:'CA2027-0005',name:'Priya Das',course:'BA Psychology',marks:'83.4',cat:'SC',status:'Approved'},
    {id:'CA2027-0006',name:'Arjun Mehta',course:'MBA',marks:'74.0',cat:'EWS',status:'Pending'}
  ];
  var apps=null;
  try{apps=JSON.parse(localStorage.getItem(KEY));}catch(e){}
  if(!Array.isArray(apps))apps=seed.slice();
  function save(){try{localStorage.setItem(KEY,JSON.stringify(apps));}catch(e){}}
  function $(s){return document.querySelector(s);}
  function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  var tt;
  function toast(m){var t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(tt);tt=setTimeout(function(){t.style.display='none';},5000);}
  var cls={Approved:'ok',Pending:'wait',Rejected:'no'};

  function render(){
    $('#admin-body').innerHTML=apps.length?apps.map(function(a){
      return '<tr><td>'+esc(a.id)+'<td>'+esc(a.name)+'<td>'+esc(a.course)+'<td>'+esc(a.marks)+'%<td>'+esc(a.cat)+
        '<td><span class="tag '+cls[a.status]+'">'+a.status+'</span>'+
        '<td><button class="mini a" data-id="'+esc(a.id)+'" data-act="Approved">Approve</button>'+
        '<button class="mini r" data-id="'+esc(a.id)+'" data-act="Rejected">Reject</button>'+
        '<button class="mini d" data-id="'+esc(a.id)+'" data-act="del">Delete</button>';
    }).join(''):'<tr><td colspan="7" style="text-align:center;color:var(--mute)">No applications yet.</td></tr>';
    var n=apps.length||1,ap=0,rj=0;
    apps.forEach(function(a){if(a.status==='Approved')ap++;else if(a.status==='Rejected')rj++;});
    var pa=ap/n*100,pp=pa+(apps.length-ap-rj)/n*100;
    var d=$('#donut');
    d.style.background='conic-gradient(var(--teal) 0 '+pa+'%,var(--amber) '+pa+'% '+pp+'%,var(--rose) '+pp+'% 100%)';
    d.style.setProperty('--t','"'+apps.length+'"');
  }

  $('#admin-body').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var id=b.getAttribute('data-id'),act=b.getAttribute('data-act');
    if(act==='del'){apps=apps.filter(function(a){return a.id!==id;});toast(id+' deleted');}
    else{apps.forEach(function(a){if(a.id===id)a.status=act;});toast(id+' marked '+act.toLowerCase());}
    save();render();
  });

  $('#apply-form').addEventListener('submit',function(e){
    e.preventDefault();
    var f=e.target,v={};
    f.querySelectorAll('label').forEach(function(l){
      var c=l.querySelector('input,select,textarea');
      if(!c||/radio|checkbox|file/.test(c.type))return;
      v[l.childNodes[0].textContent.trim()]=c.value;
    });
    var max=0;apps.forEach(function(a){var m=parseInt(a.id.split('-')[1],10);if(m>max)max=m;});
    var id='CA2027-'+String(max+1).padStart(4,'0');
    apps.unshift({id:id,name:v['Full name'],dob:v['Date of birth'],email:v['Email'],course:v['First choice'],marks:v['Percentage'],cat:v['Category'],status:'Pending'});
    save();render();
    $('#trk-id').value=id;$('#trk-dob').value=v['Date of birth']||'';
    f.reset();
    toast('Application submitted. Your Application ID is '+id);
    track();
    location.hash='#status';
  });

  function track(){
    var id=$('#trk-id').value.trim().toUpperCase(),dob=$('#trk-dob').value;
    var li=document.querySelectorAll('#trk-line li'),msg=$('#trk-msg');
    var a=apps.filter(function(x){return x.id.toUpperCase()===id;})[0];
    li.forEach(function(x){x.className='';});
    if(!a||(a.dob&&dob&&a.dob!==dob)){msg.style.color='var(--rose)';msg.textContent='No application found for that ID and date of birth.';return;}
    var st={Pending:['done','done','now'],Approved:['done','done','done','done','now'],Rejected:['done','done','done']}[a.status];
    st.forEach(function(c,i){li[i].className=c;});
    msg.style.color='var(--ink)';
    msg.textContent=a.name+', your application '+a.id+' for '+a.course+' is '+a.status.toLowerCase()+'.'+
      (a.status==='Approved'?' Bring your original documents for verification.':a.status==='Rejected'?' Please contact the admission office for details.':' It is under review.');
  }
  $('#trk-form').addEventListener('submit',function(e){e.preventDefault();track();});

  render();
})();
