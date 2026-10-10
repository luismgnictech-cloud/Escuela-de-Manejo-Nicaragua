import { VolumeX } from 'lucide-react';
import { Vehicle as Car, Walker as Person, Bicycle as Cycle, ManualGesture as Manual, TrafficAgent as Agent, SignalLight as TrafficLight, Wheelchair, Cow, SideVehicle, ServicePictogram } from './SignalPictograms';

// Original teaching diagrams. Shapes and meanings follow the reference manual;
// they are illustrations, rather than photographs of installed road signs.
const ink='#17191c', red='#d71f2c', yellow='#ffcf24', blue='#0055a4';
const text=(value,x=120,y=135,size=22,color=ink)=><text x={x} y={y} textAnchor="middle" fill={color} fontFamily="Arial, sans-serif" fontWeight="900" letterSpacing=".15" fontSize={size}>{value}</text>;
const path=(d,width=12,color=ink)=><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="miter" strokeLinecap="butt"/>;
const arrow=(d,head,color=ink,width=12)=><>{path(d,width,color)}<path d={head} fill={color}/></>;
const up=<path d="M112 169V105H93L120  70L147 105H128V169Z" fill={ink}/>;
const right=<path d="M106 169V103H145V85L177 112L145 139V121H124V169Z" fill={ink}/>;
const left=<path d="M116 169V121H95V139L63 112L95 85V103H134V169Z" fill={ink}/>;
const turnU=arrow('M143 164V106C143 72 97 72 97 106V154','M80 138L97 168L114 138Z');
function Ring({children,ban=false}){return <><circle cx="120" cy="118" r="55" fill="white" stroke={red} strokeWidth="7"/>{children}{ban&&path('M82 80L158 156',7,red)}</>}
function Road({children}){return <><rect x="50" y="28" width="140" height="184" rx="8" fill="#536168"/>{children}</>}
function Preventive({n}){switch(n){
 case 1:return right;case 2:return arrow('M95 171C95 130 109 115 150 88','M131 83L163 79L155 111Z');
 case 3:return arrow('M101 172V124H139V87','M121 99L139 71L157 99Z');
 case 4:return arrow('M111 174V153C111 126 145 136 145 112V88','M127 100L145 73L163 100Z');
 case 5:return arrow('M116 175C158 149 80 136 122 115C150 101 127 95 127 85','M109 99L125 70L145 97Z');
 case 6:return <path d="M91 66H112L147 120L112 174H91L126 120Z" fill={ink}/>;
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
 case 19:case 20:return <g transform="translate(19 13) scale(.84)"><path d="M60 176V121L180 176Z" fill={ink}/><g transform="translate(0 -9) rotate(25 120 135)"><SideVehicle truck={n===20}/></g></g>;
 case 21:return <><Car y={68}/>{path('M99 145C73 153 113 162 89 178M141 145C115 153 155 162 131 178',6)}</>;
 case 22:return <><Car x={77} y={118}/><path d="M144 70L173 102V172H143L158 153L144 134L161 119Z" fill={ink}/>{[ [130,96],[139,113],[128,126],[139,145]].map(([x,y])=><circle key={y} cx={x} cy={y} r="4" fill={ink}/>)}</>;
 case 23:return <g transform="translate(16 10) scale(.86)"><Wheelchair/></g>;
 case 24:return <><Person y={72}/>{path('M76 176H165',7)}</>;
 case 25:return text('ESCUELA',120,129,27);
 case 26:return <g transform="translate(19 12) scale(.84)"><g transform="translate(0 -13)"><SideVehicle/></g><path d="M60 176H91Q120 151 149 176H180V182H60Z" fill={ink}/></g>;
 case 27:return <Cow/>;
 case 28:return <>{text('SALIDA',120,108,22)}{text('DE',120,133,20)}{text('CAMIONES',120,156,21)}</>;
 case 29:return <>{arrow('M98 173V86','M81 99L98 72L115 99Z')}{arrow('M145 74V164','M128 151L145 178L162 151Z')}</>;
 case 30:return <><rect x="88" y="45" width="64" height="150" fill={yellow} stroke={ink} strokeWidth="4"/>{[0,1,2,3,4].map(i=><path key={i} d={`M89 ${48+i*29}L151 ${100+i*29}`} stroke={ink} strokeWidth="12" clipPath="url(#delineator)"/>)}</>;
 case 31:return <><g transform="translate(24 9) scale(.72)"><Person x={108} y={74}/></g><g transform="translate(90 58) scale(.42)"><Person x={127} y={79}/></g>{text('A 100 m',120,173,16)}</>;
 default:return null;
}}
function Regulatory({n}){const icons={45:up,46:right,47:left,48:turnU,49:turnU,52:arrow('M85 118H155','M140 100L170 118L140 136Z'),53:<Car truck/>,54:<><g transform="translate(-16 0) scale(.9)"><Car/></g><g transform="translate(55 0) scale(.9)"><Car truck/></g></>,56:<><g transform="translate(21 18) scale(.78)"><Person x={110}/></g>{arrow('M158 113H139','M149 101L131 113L149 125Z',ink,6)}</>,57:<g transform="translate(26 18) scale(.78)"><Person/></g>,58:<Cycle/>,59:text('E',120,145,64),61:<>{text('1,8 m',120,130,24)}<path d="M77 116L91 106V128ZM163 116L149 106V128Z" fill={ink}/></>,62:<>{text('3 m',120,131,30)}<path d="M120 78L108 95H132ZM120 158L108 141H132Z" fill={ink}/></>,63:<><Car x={ 70} y={97}/><Car x={132} y={97}/></>,64:<><Car x={ 70} y={97} truck/><Car x={132} y={97}/></>,65:<><path d="M82 116L151 89V144L82 125Z" fill={ink}/><path d="M92 127L104 151H118L112 133" fill={ink}/></>,66:<><circle cx="120" cy="89" r="11" fill={ink}/><path d="M100 109Q120 100 140 109L145 157H95Z" fill={ink}/>{path('M102 115L136 149',7,'white')}{path('M98 150H143',5,'white')}</>};
 if(n===41)return <><path d="M85 35h70l50 50v70l-50 50H85l-50-50V85z" fill={red} stroke="white" strokeWidth="5"/>{text('ALTO',120,137,43,'white')}</>;
 if(n===42)return <><path d="M30 40H210L120 204Z" fill={red}/><path d="M59 57H181L120 169Z" fill="white"/>{text('CEDA',120,88,24)}{text('EL',120,108,16)}{text('PASO',120,125,16)}</>;
 if(n===43||n===44)return <><Ring>{text('25',120,130,47)}</Ring>{text('km/h',120,177,17)}{n===44&&[0,1,2].map(i=><path key={i} d={`M${77+i*14} 157L${133+i*14} 76`} stroke={ink} strokeWidth="4"/>)}</>;
 if(n===50)return <><g transform="translate(-31 0)">{left}</g><g transform="translate(38 0)">{left}</g>{text('EXCLUSIVO',120,192,17)}</>;
 if(n===51)return <><Ring><g transform="translate(0 0)"><Preventive n={14}/></g></Ring>{text('INGRESO',120,194,17)}</>;
 if(n===55)return <>{text('TRÁNSITO',120,95,23)}{text('LENTO',120,125,26)}{text('CARRIL DERECHO',120,160,16)}</>;
 const legends={45:['NO HAY PASO'],46:['NO VIRAR','A LA DERECHA'],47:['NO VIRAR','A LA IZQUIERDA'],48:['NO VIRAR EN U'],49:['SE PERMITE','VIRAR EN U'],52:['MANTENGA','SU DERECHA'],53:['NO CAMIONES'],54:['CAMIONES','CARRIL DERECHO'],56:['PEATONES','POR LA IZQUIERDA'],57:['NO PEATONES'],58:['NO CICLISTAS'],59:['NO ESTACIONAR'],61:['ANCHO MÁXIMO'],62:['ALTURA MÁXIMA'],63:['NO ADELANTAR'],64:['CAMIONES','NO ADELANTAR']};
 return <><Ring ban={[45,46,47,48,53,57,58,59,63,64].includes(n)}><g transform="translate(24 24) scale(.8)">{icons[n]}</g></Ring>{legends[n]?.map((label,i)=><g key={label}>{text(label,120,legends[n].length===1?199:190+i*15,12.5)}</g>)}{n===65&&text('POLICÍA',120,195,20)}{n===66&&text('USE CINTURÓN',120,195,17)}</>;
}
function Horizontal({id}){return <Road>{id===88?<>{path('M113 37V204',5,yellow)}<path d="M128 37V204" stroke={yellow} strokeWidth="5" strokeDasharray="22 15"/>{arrow('M83 157V85','M72 96L83  70L94 96Z','white',5)}{arrow('M158 85V157','M147 146L158 172L169 146Z','white',5)}</>:id===89?path('M120 37V204',5,'white'):id===90?<path d="M120 37V204" stroke="white" strokeWidth="5" strokeDasharray="25 17"/>:id===91||id===92?<>{[0,1,2,3,4].map(i=><rect key={i} x={60+i*25} y="83" width="15" height="50" fill="white"/>)}{id===91&&path('M59 160H182',8,'white')}{id===91&&<Car y={170} x={96} color="#a2dcef"/>}</>:id===93?<path d="M75 65H165L120 167Z" fill="none" stroke="white" strokeWidth="9"/>:id===94?<><rect x="151" y="28" width="39" height="184" fill="#96a7a0"/>{path('M148 37V204',5,'white')}{text('ARCÉN',171,130,10,ink)}</>:id==='double-yellow'?<>{path('M113 37V204',5,yellow)}{path('M127 37V204',5,yellow)}</>:id==='broken-yellow'?<path d="M120 37V204" stroke={yellow} strokeWidth="5" strokeDasharray="25 17"/>:id==='lane-arrows'?<><g transform="translate(-33 35) scale(.8)">{arrow('M120 168V82','M102 99L120 72L138 99Z','white')}</g><g transform="translate(63 35) scale(.8)">{arrow('M120 168V112H84','M100 94L70 112L100 130Z','white')}</g></>:<>{arrow('M120 173V81','M102 98L120 71L138 98Z','white')}{arrow('M120 133H157','M145 116L173 133L145 150Z','white')}</>}</Road>}
export default function SignalIllustration({id,title}){const n=Number(id.replace('manual-',''));let drawing,background;
 if(n>=1&&n<=31){background=n===30?null:n===6?<rect x="76" y="27" width="88" height="186" rx="11" fill={yellow} stroke={ink} strokeWidth="4"/>:n===25?<rect x="26" y="84" width="188" height="72" rx="11" fill={yellow} stroke={ink} strokeWidth="4"/>:<path d="M115 21Q120 16 125 21L219 115Q224 120 219 125L125 219Q120 224 115 219L21 125Q16 120 21 115Z" fill={yellow} stroke={ink} strokeWidth="4"/>;drawing=n===9?path('M120 76V170M76 120H164'): <Preventive n={n}/>;}
 else if(n>=32&&n<=40){background=[36,37,38,39,40].includes(n)?<path d="M120 18L222 120L120 222L18 120Z" fill="#ff923d" stroke={ink} strokeWidth="5"/>:<rect x="24" y="43" width="192" height="154" rx="16" fill="#ff923d" stroke={ink} strokeWidth="5"/>;drawing=n===39?<><Person arms="flag"/><path d="M153 106V82h25v17h-25" fill={ink}/></>:n===35?<>{[0,1,2,3].map(i=><path key={i} d={`M44 ${67+i*31}L120 ${101+i*31}L196 ${67+i*31}`} stroke="white" strokeWidth="12" fill="none"/>)}</>:n===32?<>{text('RUTA',120,97,25)}{text('PROVISIONAL',120,130,20)}{arrow('M74 163H161','M146 150L172 163L146 176Z',ink,6)}</>:n===33?<>{text('FIN DEL',120,112,25)}{text('DESVÍO',120,146,25)}</>:n===34?<>{text('DESVÍO',120,104,28)}{arrow('M65 148H166','M151 132L181 148L151 164Z',ink,9)}</>:n===36?<>{text('CARRETERA',120,100,18)}{text('EN',120,126,18)}{text('CONSTRUCCIÓN',120,153,15)}</>:n===37?<>{text('DESVÍO',120,119,26)}{text('300 m',120,151,23)}</>:n===38?<>{text('CAMINO',120,98,23)}{text('CERRADO',120,125,23)}{text('300 m',120,152,21)}</>:<>{text('PUENTE EN',120,97,19)}{text('REPARACIÓN',120,125,17)}{text('ADELANTE',120,152,19)}</>;}
 else if(n>=41&&n<=66){background=n===41||n===42?null:<><rect x="36" y="19" width="168" height="202" rx="16" fill="white" stroke="#cbd3d7" strokeWidth="2"/><rect x="41" y="24" width="158" height="192" rx="12" fill="none" stroke={ink} strokeWidth="2.5"/></>;drawing=<Regulatory n={n}/>;}
 else if(n>=67&&n<=76){background=<><rect x="35" y="22" width="170" height="196" rx="14" fill="white" stroke="#cbd3d7" strokeWidth="1.5"/><rect x="41" y="28" width="158" height="184" rx="10" fill={blue}/></>;drawing=<ServicePictogram n={n}/>;}
 else if(n>=77&&n<=79)drawing=<Manual n={n}/>;
 else if(n>=83&&n<=87)drawing=<TrafficLight n={n}/>;
 else if(n>=88&&n<=94||['double-yellow','broken-yellow','lane-arrows','combined-arrow'].includes(id))drawing=<Horizontal id={Number.isNaN(n)?id:n}/>;
 else if(id.startsWith('agent-'))drawing=<Agent id={id}/>;
 else if(id==='silence')drawing=<><Ring ban><VolumeX x="84" y="83" width="72" height="72" strokeWidth="3"/></Ring></>;
 else if(id==='straight')drawing=<><Ring>{up}</Ring></>;
 else if(id==='emergency')drawing=<><ellipse cx="120" cy="215" rx=" 60" ry="5" fill="#dde4e7"/><rect x=" 80" y="177" width="14" height=" 30" rx="4" fill={ink}/><rect x="146" y="177" width="14" height=" 30" rx="4" fill={ink}/><path d="M86  70Q87 61 97 61H143Q153 61 154  70L167 113V189Q120 201 73 189V113Z" fill="white" stroke="#44596a" strokeWidth="3"/><path d="M92 78H148L156 114H84Z" fill="#cce7f2" stroke="#7295a8" strokeWidth="2"/><path d="M120 80V111" stroke="#7295a8" strokeWidth="2"/><rect x=" 80" y="165" width="19" height="10" rx="3" fill="#ffc857"/><rect x="141" y="165" width="19" height="10" rx="3" fill="#ffc857"/><rect x="107" y="178" width="26" height="7" rx="2" fill="#8196a4"/><path d="M109 131H131M120 120V142" stroke={red} strokeWidth="8"/><rect x="94" y="47" width="26" height="12" rx="3" fill={red}/><rect x="120" y="47" width="26" height="12" rx="3" fill={blue}/></>;
 return <svg viewBox="0 0 240 240" role="img" aria-label={title} width="240" height="240" className="ts-illustration"><title>{title}</title>{n===30&&<defs><clipPath id="delineator"><rect x="88" y="45" width="64" height="150"/></clipPath></defs>}<g color={ink}>{background}{drawing}</g></svg>;
}
