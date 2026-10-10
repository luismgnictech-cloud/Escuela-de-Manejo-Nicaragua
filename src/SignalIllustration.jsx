import { Accessibility, Phone, Fuel, Plane, Tent, Utensils, BusFront, Cross, VolumeX } from 'lucide-react';

// Original teaching diagrams. Shapes and meanings follow the reference manual;
// they are illustrations, rather than photographs of installed road signs.
const ink='#17262c', red='#d92536', yellow='#ffd442', blue='#1754ad';
const text=(value,x=120,y=135,size=22,color=ink)=><text x={x} y={y} textAnchor="middle" fill={color} fontFamily="Arial, sans-serif" fontWeight="800" fontSize={size}>{value}</text>;
const path=(d,width=12,color=ink)=><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round"/>;
const arrow=(d,head,color=ink,width=12)=><>{path(d,width,color)}<path d={head} fill={color}/></>;
const up=arrow('M120 166V82','M102 99L120 72L138 99Z');
const right=arrow('M120 168V112H156','M140 94L170 112L140 130Z');
const left=arrow('M120 168V112H84','M100 94L70 112L100 130Z');
const turnU=arrow('M143 164V106C143 72 97 72 97 106V154','M80 138L97 168L114 138Z');
function Car({x=94,y=101,truck=false,color=ink}){return <g fill={color}><path d={`M${x} ${y+18}l8-18h32l8 18v31h-48z`}/><rect x={x+9} y={y+7} width="30" height="13" rx="2" fill="white"/>{truck&&<rect x={x+2} y={y-24} width="44" height="25" rx="2"/>}<rect x={x+5} y={y+43} width="10" height="13" rx="2"/><rect x={x+33} y={y+43} width="10" height="13" rx="2"/></g>}
function Person({x=120,y=82,color=ink,arms='down'}){return <g stroke={color} fill={color} strokeWidth="9" strokeLinecap="round"><circle cx={x} cy={y} r="9" stroke="none"/>{path(`M${x} ${y+19}V${y+50}M${x} ${y+49}L${x-15} ${y+80}M${x} ${y+49}L${x+15} ${y+80}`,10,color)}{path(arms==='flag'?`M${x-30} ${y+29}H${x+30}`:`M${x-23} ${y+43}L${x} ${y+19}L${x+23} ${y+43}`,9,color)}</g>}
function Cycle(){return <g stroke={ink} strokeWidth="5" fill="none"><circle cx="85" cy="149" r="20"/><circle cx="157" cy="149" r="20"/><path d="M85 149L108 112L135 149H85L118 128L157 149L141 99H154M99 108H116"/></g>}
function Ring({children,ban=false}){return <><circle cx="120" cy="118" r="55" fill="white" stroke={red} strokeWidth="7"/>{children}{ban&&path('M82 80L158 156',7,red)}</>}
function Road({children}){return <><rect x="50" y="28" width="140" height="184" rx="8" fill="#536168"/>{children}</>}
function TrafficLight({n}){const active={83:0,84:1,85:2,86:0,87:1}[n];return <><rect x="84" y="27" width="72" height="185" rx="24" fill={ink}/>{['#ee3449','#ffc932','#32b567'].map((color,i)=><circle key={i} cx="120" cy={64+i*60} r="23" fill={i===active?color:'#3b484e'} stroke={i===active?'white':'#59666b'} strokeWidth="2"/>)}{n>85&&<g stroke={active===0?red:'#c18700'} strokeWidth="4">{[0,1,2,3].map(i=><path key={i} d={i<2?`M${i?171:59} ${64+active*60}h${i?15:-15}`:`M120 ${64+active*60+(i===2?-38:38)}v${i===2?-12:12}`}/>)}</g>}</>}
function Manual({n}){return <><rect x="146" y="42" width="58" height="169" rx="20" fill="#b7c5cf" stroke={ink} strokeWidth="4"/><rect x="158" y="58" width="35" height="57" rx="9" fill="#eaf4fb"/><rect x="158" y="156" width="35" height="32" rx="6" fill="#eaf4fb"/><circle cx="166" cy="128" r="12" fill={ink}/>{path('M158 137L143 118',12)}{path(n===77?'M145 118H68':n===78?'M145 118H93V63':'M145 118H94V178',11)}<circle cx={n===77?63:94} cy={n===78?58:n===79?183:118} r="8" fill={ink}/>{n===77?arrow('M83 82H48','M58 70L35 82L58 94Z',blue,5):n===78?arrow('M56 87V49','M44 61L56 38L68 61Z',blue,5):arrow('M56 150V189','M44 177L56 200L68 177Z',blue,5)}</>}
function Agent({id}){const stop=id==='agent-stop',go=id==='agent-go';return <>
 <circle cx="120" cy="64" r="17" fill={ink}/>{go&&<path d="M133 55l17 12-17 9" fill={ink}/>}
 <path d="M97 54h46l-8-14h-30z" fill={blue}/><path d="M96 91h48v66H96z" fill="#8dde58" stroke={ink} strokeWidth="4"/>{path('M105 99V146M135 99V146',5,'white')}{path('M108 159L104 205M132 159L136 205',13)}
 {path(stop?'M99 101H76V61M141 101H164V61':go?'M99 101H83V49M141 101L153 149':'M99 101L83 73V29M141 101L190 145',11)}
 {stop&&<>{path('M76 61V43M68 59V47M84 59V47M164 61V43M156 59V47M172 59V47',4)}</>}
 {go&&<>{path('M83 49V30M75 47V34M91 47V34',4)}{arrow('M174 86V137','M164 125L174 148L184 125Z',blue,5)}</>}
 {id==='agent-edge'&&<>{path('M83 29V13M76 28V17M90 28V17',4)}<circle cx="190" cy="145" r="7" fill={ink}/></>}
 </>}
function Preventive({n}){switch(n){
 case 1:return right;case 2:return arrow('M95 171C95 130 109 115 150 88','M131 83L163 79L155 111Z');
 case 3:return arrow('M101 172V124H139V87','M121 99L139 71L157 99Z');
 case 4:return arrow('M111 174V153C111 126 145 136 145 112V88','M127 100L145 73L163 100Z');
 case 5:return arrow('M116 175C158 149 80 136 122 115C150 101 127 95 127 85','M109 99L125 70L145 97Z');
 case 6:return <path d="M92 68H122L157 120L122 172H92L128 120Z" fill={ink}/>;
 case 7:return <>{path('M85 154V111C85 75 154  70 154 115V146',7)}<path d="M143 132L154 158L166 132Z" fill={ink}/>{text('30',120,121,30)}{text('km/h',120,143,15)}</>;
 case 8:return <><g transform="translate(13 0) rotate(-15 120 123)"><Car truck/></g>{path('M79 106C70 59 173 54 168 101',6)}<path d="M156 92L167 108L180 93Z" fill={ink}/></>;
 case 9:return path('M120 76V170M76 120H164');
 case 10:return path('M82 94H158M120 94V171');
 case 11:return path('M120 172V122L88 90M120 122L152 90');
 case 12:return <>{arrow('M120 102V78','M104 88L120 64L136 88Z',ink,7)}<path d="M102 111h36l25 25v32l-25 24h-36l-25-24v-32z" fill={red} stroke={ink} strokeWidth="3"/>{text('ALTO',120,159,18,'white')}</>;
 case 13:return <><rect x="102" y="70" width="36" height="103" rx="8" fill={ink}/>{[red,yellow,'#35a853'].map((c,i)=><circle key={c} cx="120" cy={88+i*33} r="12" fill={c}/>)}</>;
 case 14:return <>{path('M95 90C114 65 160 81 158 114M152 145C132 171 83 154 83 121',7)}<path d="M145 99L159 121L171 98ZM96 134L81 113L68 137Z" fill={ink}/></>;
 case 15:return <>{path('M140 75V175M100 75V112L116 139V175',11)}</>;
 case 16:return <>{text('3,20',120,112,27)}{text('m',120,143,25)}<path d="M73 117L91 105V130ZM167 117L149 105V130Z" fill={ink}/></>;
 case 17:return <>{path('M88 78L102 105V142L88 168M152 78L138 105V142L152 168',9)}</>;
 case 18:return <>{text('2,10 m',120,132,25)}<path d="M120 77L105 94H135ZM120 166L105 149H135Z" fill={ink}/></>;
 case 19:case 20:return <><path d="M70 167V113L170 167Z" fill={ink}/><g transform="rotate(30 120 111) translate(0 -17)"><Car truck={n===20}/></g></>;
 case 21:return <><Car y={68}/>{path('M99 145C73 153 113 162 89 178M141 145C115 153 155 162 131 178',6)}</>;
 case 22:return <><Car x={77} y={118}/><path d="M144 70L173 102V172H143L158 153L144 134L161 119Z" fill={ink}/>{[ [130,96],[139,113],[128,126],[139,145]].map(([x,y])=><circle key={y} cx={x} cy={y} r="4" fill={ink}/>)}</>;
 case 23:return <Accessibility x="78" y="70" width="84" height="84" strokeWidth="2.7"/>;
 case 24:return <><Person y={72}/>{path('M76 176H165',7)}</>;
 case 25:return text('ESCUELA',120,129,27);
 case 26:return <><g transform="translate(0 -25)"><Car/></g><path d="M66 170H93Q120 139 147 170H174" fill="none" stroke={ink} strokeWidth="8"/></>;
 case 27:return <><path d="M75 105L95 91L143 96L163 108L153 128L145 130V156H136V132H102V158H93V127L78 123Z" fill={ink}/><path d="M77 104L66 90M153 106L169 93M143 104L146 87" stroke={ink} strokeWidth="6"/></>;
 case 28:return <>{text('SALIDA',120,108,22)}{text('DE',120,133,20)}{text('CAMIONES',120,156,21)}</>;
 case 29:return <>{arrow('M98 173V86','M81 99L98 72L115 99Z')}{arrow('M145 74V164','M128 151L145 178L162 151Z')}</>;
 case 30:return <><rect x="88" y="45" width="64" height="150" fill={yellow} stroke={ink} strokeWidth="4"/>{[0,1,2,3,4].map(i=><path key={i} d={`M89 ${48+i*29}L151 ${100+i*29}`} stroke={ink} strokeWidth="12" clipPath="url(#delineator)"/>)}</>;
 case 31:return <><Person x={108} y={74}/><g transform="translate(38 34) scale(.66)"><Person x={127} y={79}/></g>{text('A 100 m',120,187,16)}</>;
 default:return null;
}}
function Regulatory({n}){const icons={45:up,46:right,47:left,48:turnU,49:turnU,52:arrow('M85 118H155','M140 100L170 118L140 136Z'),53:<Car truck/>,54:<><g transform="translate(-16 0) scale(.9)"><Car/></g><g transform="translate(55 0) scale(.9)"><Car truck/></g></>,56:<><Person x={110} y={ 80}/>{arrow('M158 113H139','M149 101L131 113L149 125Z',ink,6)}</>,57:<Person y={ 80}/>,58:<Cycle/>,59:text('E',120,145,64),61:<>{text('1,8 m',120,130,24)}<path d="M77 116L91 106V128ZM163 116L149 106V128Z" fill={ink}/></>,62:<>{text('3 m',120,131,30)}<path d="M120 78L108 95H132ZM120 158L108 141H132Z" fill={ink}/></>,63:<><Car x={ 70} y={97}/><Car x={132} y={97}/></>,64:<><Car x={ 70} y={97} truck/><Car x={132} y={97}/></>,65:<><path d="M82 116L151 89V144L82 125Z" fill={ink}/><path d="M92 127L104 151H118L112 133" fill={ink}/></>,66:<><circle cx="120" cy="89" r="11" fill={ink}/><path d="M100 109Q120 100 140 109L145 157H95Z" fill={ink}/>{path('M102 115L136 149',7,'white')}{path('M98 150H143',5,'white')}</>};
 if(n===41)return <><path d="M85 35h70l50 50v70l-50 50H85l-50-50V85z" fill={red} stroke="white" strokeWidth="5"/>{text('ALTO',120,137,43,'white')}</>;
 if(n===42)return <><path d="M30 40H210L120 204Z" fill={red}/><path d="M59 57H181L120 169Z" fill="white"/>{text('CEDA',120,91,24)}{text('EL PASO',120,119,20)}</>;
 if(n===43||n===44)return <><Ring>{text('25',120,130,47)}</Ring>{text('km/h',120,177,17)}{n===44&&[0,1,2].map(i=><path key={i} d={`M${77+i*14} 157L${133+i*14} 76`} stroke={ink} strokeWidth="4"/>)}</>;
 if(n===50)return <><g transform="translate(-31 0)">{left}</g><g transform="translate(38 0)">{left}</g>{text('EXCLUSIVO',120,192,17)}</>;
 if(n===51)return <><Ring><g transform="translate(0 0)"><Preventive n={14}/></g></Ring>{text('INGRESO',120,194,17)}</>;
 if(n===55)return <>{text('TRÁNSITO',120,95,23)}{text('LENTO',120,125,26)}{text('CARRIL DERECHO',120,160,16)}</>;
 return <><Ring ban={[45,46,47,48,53,57,58,59,63,64].includes(n)}>{icons[n]}</Ring>{n===65&&text('POLICÍA',120,195,20)}{n===66&&text('USE CINTURÓN',120,195,17)}</>;
}
const infoIcons={67:Phone,68:Fuel,69:Cross,71:Accessibility,72:Cross,73:Tent,74:Utensils,75:BusFront,76:Plane};
function Horizontal({id}){return <Road>{id===88?<>{path('M113 37V204',5,yellow)}<path d="M128 37V204" stroke={yellow} strokeWidth="5" strokeDasharray="22 15"/>{arrow('M83 157V85','M72 96L83  70L94 96Z','white',5)}{arrow('M158 85V157','M147 146L158 172L169 146Z','white',5)}</>:id===89?path('M120 37V204',5,'white'):id===90?<path d="M120 37V204" stroke="white" strokeWidth="5" strokeDasharray="25 17"/>:id===91||id===92?<>{[0,1,2,3,4].map(i=><rect key={i} x={60+i*25} y="83" width="15" height="50" fill="white"/>)}{id===91&&path('M59 160H182',8,'white')}{id===91&&<Car y={170} x={96} color="#a2dcef"/>}</>:id===93?<path d="M75 65H165L120 167Z" fill="none" stroke="white" strokeWidth="9"/>:id===94?<><rect x="151" y="28" width="39" height="184" fill="#96a7a0"/>{path('M148 37V204',5,'white')}{text('ARCÉN',171,130,10,ink)}</>:id==='double-yellow'?<>{path('M113 37V204',5,yellow)}{path('M127 37V204',5,yellow)}</>:id==='broken-yellow'?<path d="M120 37V204" stroke={yellow} strokeWidth="5" strokeDasharray="25 17"/>:id==='lane-arrows'?<><g transform="translate(-33 35) scale(.8)">{arrow('M120 168V82','M102 99L120 72L138 99Z','white')}</g><g transform="translate(63 35) scale(.8)">{arrow('M120 168V112H84','M100 94L70 112L100 130Z','white')}</g></>:<>{arrow('M120 173V81','M102 98L120 71L138 98Z','white')}{arrow('M120 133H157','M145 116L173 133L145 150Z','white')}</>}</Road>}
export default function SignalIllustration({id,title}){const n=Number(id.replace('manual-',''));let drawing,background;
 if(n>=1&&n<=31){background=n===30?null:n===6||n===25?<rect x="36" y="32" width="168" height="176" rx="18" fill={yellow} stroke={ink} strokeWidth="5"/>:<path d="M120 18L222 120L120 222L18 120Z" fill={yellow} stroke={ink} strokeWidth="5"/>;drawing=n===9?path('M120 76V170M76 120H164'): <Preventive n={n}/>;}
 else if(n>=32&&n<=40){background=[36,37,38,39,40].includes(n)?<path d="M120 18L222 120L120 222L18 120Z" fill="#ff9a42" stroke={ink} strokeWidth="5"/>:<rect x="24" y="43" width="192" height="154" rx="16" fill="#ff9a42" stroke={ink} strokeWidth="5"/>;drawing=n===39?<><Person arms="flag"/><path d="M153 106V82h25v17h-25" fill={ink}/></>:n===35?<>{[0,1,2,3].map(i=><path key={i} d={`M44 ${67+i*31}L120 ${101+i*31}L196 ${67+i*31}`} stroke="white" strokeWidth="12" fill="none"/>)}</>:n===32?<>{text('RUTA',120,97,25)}{text('PROVISIONAL',120,130,20)}{arrow('M74 163H161','M146 150L172 163L146 176Z',ink,6)}</>:n===33?<>{text('FIN DEL',120,112,25)}{text('DESVÍO',120,146,25)}</>:n===34?<>{text('DESVÍO',120,104,28)}{arrow('M65 148H166','M151 132L181 148L151 164Z',ink,9)}</>:n===36?<>{text('CARRETERA',120,100,18)}{text('EN',120,126,18)}{text('CONSTRUCCIÓN',120,153,15)}</>:n===37?<>{text('DESVÍO',120,119,26)}{text('300 m',120,151,23)}</>:n===38?<>{text('CAMINO',120,98,23)}{text('CERRADO',120,125,23)}{text('300 m',120,152,21)}</>:<>{text('PUENTE EN',120,97,19)}{text('REPARACIÓN',120,125,17)}{text('ADELANTE',120,152,19)}</>;}
 else if(n>=41&&n<=66){background=n===41||n===42?null:<rect x="42" y="27" width="156" height="186" rx="20" fill="white" stroke={ink} strokeWidth="4"/>;drawing=<Regulatory n={n}/>;}
 else if(n>=67&&n<=76){background=<rect x="41" y="30" width="158" height="180" rx="20" fill={blue} stroke="white" strokeWidth="5"/>;const Icon=infoIcons[n];drawing=n===72?<><g fill="white"><rect x="104" y="60" width="32" height="120"/><rect x="104" y="60" width="32" height="120" transform="rotate(60 120 120)"/><rect x="104" y="60" width="32" height="120" transform="rotate(120 120 120)"/></g>{path('M120 83V157',5,blue)}{path('M125 92C103 94 133 112 116 123C106 131 130 141 116 147',4,blue)}</>:n===70?text('E',120,151,90,'white'):Icon?<Icon x="74" y="73" width="92" height="92" stroke="white" strokeWidth="2.4"/>:null;}
 else if(n>=77&&n<=79)drawing=<Manual n={n}/>;
 else if(n>=83&&n<=87)drawing=<TrafficLight n={n}/>;
 else if(n>=88&&n<=94||['double-yellow','broken-yellow','lane-arrows','combined-arrow'].includes(id))drawing=<Horizontal id={Number.isNaN(n)?id:n}/>;
 else if(id.startsWith('agent-'))drawing=<Agent id={id}/>;
 else if(id==='silence')drawing=<><Ring ban><VolumeX x="84" y="83" width="72" height="72" strokeWidth="3"/></Ring></>;
 else if(id==='straight')drawing=<><Ring>{up}</Ring></>;
 else if(id==='emergency')drawing=<><Car x={ 80} y={90} color="white"/>{path('M90 118H154',3,ink)}<rect x="77" y="84" width="84" height="104" rx="9" fill="white" stroke={ink} strokeWidth="4"/><rect x="94" y="104" width="52" height="26" fill="#d9edf5"/>{path('M107 154H133M120 141V167',7,red)}<rect x="90" y="68" width="30" height="12" fill={red}/><rect x="120" y="68" width="30" height="12" fill={blue}/></>;
 return <svg viewBox="0 0 240 240" role="img" aria-label={title} width="240" height="240" className="ts-illustration"><title>{title}</title>{n===30&&<defs><clipPath id="delineator"><rect x="88" y="45" width="64" height="150"/></clipPath></defs>}<g color={ink}>{background}{drawing}</g></svg>;
}
