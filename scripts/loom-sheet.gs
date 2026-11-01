/** Deploy as an Apps Script web app, execute as yourself. Server-to-server only. */
const HEADERS = ['Request ID','Timestamp','Country','Name','Work email','Company website','Role','Workflow','UTM source','UTM medium','UTM campaign','UTM content','Referrer','Landing page','Status','Loom URL','Notification'];
function doPost(event) {
 const props=PropertiesService.getScriptProperties();
 const output=value=>ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
 let body;try{body=JSON.parse(event.postData.contents)}catch(e){return output({ok:false})}
 const secret=props.getProperty('WEBHOOK_SECRET');
 if(!secret||body.secret!==secret)return output({ok:false});
 const lead=body.lead||{};
 if(!/^[a-zA-Z0-9-]{16,80}$/.test(lead.requestId||'')||typeof lead.workflow!=='string'||lead.workflow.length<20||lead.workflow.length>600)return output({ok:false});
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try {
  const spreadsheet=SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
  const sheet=spreadsheet.getSheetByName('Loom requests')||spreadsheet.insertSheet('Loom requests');
  if(!sheet.getLastRow()){sheet.appendRow(HEADERS);sheet.setFrozenRows(1);sheet.getRange(1,1,1,HEADERS.length).setFontWeight('bold').setBackground('#18181b').setFontColor('#fafafa');}
  const safe=value=>{const text=String(value==null?'':value);return /^[=+\-@\t\r]/.test(text)?"'"+text:text};
  const ids=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues():[];
  let row=ids.findIndex(value=>String(value[0])===lead.requestId)+2;
  if(row<2){sheet.appendRow([lead.requestId,lead.timestamp,lead.country,lead.name,lead.email||'',lead.website,lead.role,lead.workflow,lead.utm_source,lead.utm_medium,lead.utm_campaign,lead.utm_content,lead.referrer,lead.landing_page,'New','','Pending'].map((value,index)=>index===1?new Date(value):safe(value)));sheet.getRange(sheet.getLastRow(),2).setNumberFormat('yyyy-mm-dd hh:mm');row=sheet.getLastRow();SpreadsheetApp.flush();}
  let notified=sheet.getRange(row,17).getValue()==='Sent';
  if(!notified){try{const recipient=props.getProperty('NOTIFICATION_EMAIL');if(!recipient)throw Error('Missing email');MailApp.sendEmail({to:recipient,subject:'Loom request — '+String(lead.website||'').replace(/[\r\n]/g,' '),body:HEADERS.slice(0,14).map((name,index)=>name+': '+sheet.getRange(row,index+1).getDisplayValue()).join('\n\n')+'\n\n'+spreadsheet.getUrl(),...(lead.email?{replyTo:lead.email}:{})});sheet.getRange(row,17).setValue('Sent');notified=true;}catch(e){sheet.getRange(row,17).setValue('Pending');}}
  return output({ok:true,saved:true,notified});
 } finally {lock.releaseLock();}
}
function retryPendingNotifications(){const lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;try{const p=PropertiesService.getScriptProperties();const s=SpreadsheetApp.openById(p.getProperty('SPREADSHEET_ID')).getSheetByName('Loom requests');if(!s||s.getLastRow()<2)return;s.getRange(2,1,s.getLastRow()-1,17).getValues().forEach((row,index)=>{if(row[16]!=='Sent'){try{MailApp.sendEmail({to:p.getProperty('NOTIFICATION_EMAIL'),subject:'Loom request — '+String(row[5]).replace(/[\r\n]/g,' '),body:HEADERS.slice(0,14).map((name,i)=>name+': '+row[i]).join('\n\n')});s.getRange(index+2,17).setValue('Sent');}catch(e){}}});}finally{lock.releaseLock();}}
