// Reusable vector artwork for the course's sign illustrations.
// Each silhouette is authored here so detail and proportions remain consistent.
const BLACK='#17191c';
const line=(d,width=5,color=BLACK)=><path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"/>;
export function Vehicle({x=94,y=101,truck=false,color=BLACK}){return <g transform={`translate(${x} ${y})`}>
 {truck?<><path d="M2-22Q2-26 6-26H42Q46-26 46-22V20H2Z" fill={color}/><path d="M6 14H42L48 31V50H0V31Z" fill={color}/><rect x="10" y="20" width="28" height="13" rx="2" fill="white"/>{line('M5 42H43',2,'white')}</>:<><path d="M7 2Q9-2 15-2H33Q39-2 41 2L47 20Q50 25 50 30V46H-2V30Q-2 25 1 20Z" fill={color}/><path d="M12 4H36L41 19H7Z" fill="white"/><rect x="5" y="25" width="10" height="5" rx="1.5" fill="white"/><rect x="33" y="25" width="10" height="5" rx="1.5" fill="white"/>{line('M18 37H30',2,'white')}</>}
 <rect x="2" y="42" width="9" height="13" rx="2.5" fill={color}/><rect x="37" y="42" width="9" height="13" rx="2.5" fill={color}/>
 </g>}
export function SideVehicle({truck=false}){return <g fill={BLACK}>
 {truck?<><path d="M68 91H130V133H68Z"/><path d="M132 106H153L167 122V143H128V111Z"/><path d="M137 111H151L159 121H137Z" fill="#ffcf24"/></>:<><path d="M65 122L79 118L91 98Q94 94 101 94H129L147 116L169 121V141H65Z"/><path d="M97 100H112V115H87ZM118 100H128L140 115H118Z" fill="#ffcf24"/></>}
 <circle cx="86" cy="142" r="12"/><circle cx="147" cy="142" r="12"/><circle cx="86" cy="142" r="5" fill="#ffcf24"/><circle cx="147" cy="142" r="5" fill="#ffcf24"/>
 </g>}
export function Walker({x=120,y=82,color=BLACK,arms='down'}){return <g transform={`translate(${x-120} ${y-82})`} fill={color}>
 <circle cx="120" cy="82" r="9.5"/><path d="M117 96Q123 91 128 97L139 116L156 122Q162 125 158 130Q156 133 152 131L132 124L123 110L116 137L130 149L143 173Q146 181 139 183Q134 184 130 177L119 157L103 148L89 177Q84 185 77 181Q72 178 77 170L96 132L103 106L86 120L82 137Q81 145 75 143Q70 142 72 135L77 114L102 96Q109 91 117 96Z"/>
 {arms==='flag'&&<path d="M106 105H70V94H169V105H130Z"/>}
 </g>}
export function Wheelchair({color=BLACK}){return <g fill={color}>
 <circle cx="126" cy="77" r="11"/><path d="M117 95Q122 88 129 94L132 115H151Q157 115 160 121L178 153L168 159L151 129H122Q115 129 114 122L110 101Z"/>
 {line('M111 113C92 114 81 128 81 147C81 167 96 181 114 181C129 181 142 172 146 158',9,color)}{line('M125 99H148',7,color)}
 </g>}
export function Bicycle(){return <g fill="none" stroke={BLACK} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="85" cy="147" r="20"/><circle cx="158" cy="147" r="20"/><path d="M85 147L106 112L134 147H85L116 121L158 147L145 102M99 110H116M138 101H155"/><circle cx="132" cy="147" r="3" fill={BLACK}/></g>}
export function Cow(){return <g fill={BLACK}><path d="M64 111Q61 103 65 95L70 97Q69 103 72 109L81 102Q84 96 98 97L133 100L142 95L151 101L162 97L174 106L171 119L159 122L154 137L149 160H140L140 132L130 135H100L96 161H87L87 135L77 132L71 117Z"/><path d="M146 99L140 85Q149 86 153 95L161 86L165 91L160 100ZM91 133L92 153H101L106 135"/><ellipse cx="167" cy="111" rx="2" ry="2" fill="#ffcf24"/><path d="M115 132v9h7v-9"/></g>}
export function ServicePictogram({n}){const white='white';switch(n){
 case 67:return <path d="M86  60Q75 62 78 80C82 121 111 157 150 177Q160 181 168 171L176 158Q180 153 174 149L150 133Q144 129 140 135L132 146Q112 136 101 114L110 105Q116 100 112 94L96  60Q92 55 86  60Z" fill={white}/>;
 case 68:return <g fill={white}><rect x="75" y="70" width="61" height="104" rx="6"/><rect x="86" y="82" width="39" height="32" rx="2" fill="#0055a4"/><rect x="67" y="173" width="79" height="9"/><path d="M147  80L165 101V128H154V108L141 93Z"/>{line('M136 122H145V159Q145 173 158 173Q170 173 170 159V126',6,white)}</g>;
 case 69:return <path d="M104  60H136V104H180V136H136V180H104V136H60V104H104Z" fill={white}/>;
 case 70:return <text x="120" y="160" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="113" fill={white}>E</text>;
 case 71:return <Wheelchair color={white}/>;
 case 72:return <><g fill={white}><rect x="105" y="62" width="30" height="116"/><rect x="105" y="62" width="30" height="116" transform="rotate(60 120 120)"/><rect x="105" y="62" width="30" height="116" transform="rotate(120 120 120)"/></g>{line('M120 84V158',4,'#0055a4')}{line('M125  90C108 92 111 104 124 110C135 116 110 123 116 133C120 138 125 139 120 145',4,'#0055a4')}</>;
 case 73:return <><path d="M 60 177L120  70L180 177Z" fill={white}/><path d="M99 177L120 125L141 177Z" fill="#0055a4"/>{line('M120 71L120 59M60 178H180',5,white)}</>;
 case 74:return <g fill={white}><path d="M81  60H87V91H93V 60H99V91H105V 60H111V101Q111 113 102 116V179H89V116Q81 113 81 101Z"/><path d="M146  60Q127 74 127 110V126H142V179H156V 60Z"/></g>;
 case 75:return <g fill={white}><path d="M82  60Q120 51 158  60L165  70V168H75V 70Z"/><rect x="88" y="77" width="64" height="51" rx="5" fill="#0055a4"/><rect x="89" y="60" width="62" height="8" rx="2" fill="#0055a4"/><circle cx="94" cy="148" r="7" fill="#0055a4"/><circle cx="146" cy="148" r="7" fill="#0055a4"/><rect x="86" y="162" width="12" height="19" rx="3"/><rect x="142" y="162" width="12" height="19" rx="3"/></g>;
 case 76:return <path d="M113  70Q120 55 127  70L130 108L183 143V154L129 135V164L145 178V187L120 179L95 187V178L111 164V135L57 154V143L110 108Z" fill={white} transform="rotate(35 120 120)"/>;
 default:return null;
}}
function Hand({x,y,rotate=0}){return <g transform={`translate(${x} ${y}) rotate(${rotate})`} fill="#dcaa82" stroke="#b17b54" strokeWidth=".8"><path d="M-6 7L-7-2L-12-8Q-14-12-10-13L-5-8V-22Q-5-26-2-26Q1-26 1-22V-11V-27Q1-31 4-31Q7-31 7-27V-11V-24Q7-28 10-28Q13-28 13-24V-8V-17Q13-21 16-20Q18-20 18-16V2Q18 10 10 13H-1Z"/></g>}
export function TrafficAgent({id}){const stop=id==='agent-stop',go=id==='agent-go';return <>
 <ellipse cx="120" cy="215" rx="58" ry="5" fill="#dce3e5"/>
 <path d="M105 154H119L117 204H100ZM122 154H139L143 204H128Z" fill="#24364b"/><path d="M100 201H117V214H94Q92 208 100 201ZM129 201H143L150 210V214H129Z" fill="#17212c"/>
 <path d="M102 85Q120 76 138 85L146 149Q120 158 95 149Z" fill="#2d4869"/>
 {line(stop?'M103 93L 70 104L 60  70M137 93L170 104L180  70':go?'M103 93L80 96L75 55M137 94L154 142':'M103 93L 80  70L82 40M137 94L178 143',16,'#2d4869')}
 <path d="M106 82H114L120 102L126 82H136L143 149H99Z" fill="#ccdf48"/><path d="M110 88L107 144M132 88L136 144" stroke="#eef2e5" strokeWidth="5"/><rect x="101" y="124" width="39" height="6" fill="#eef2e5"/><rect x="115" y="151" width="12" height="5" rx="1" fill="#9babb8"/>
 <path d="M112 74V84L120 92L129 83V74" fill="#cc9871"/>
 <ellipse cx="120" cy="60" rx="17" ry="21" fill="#dcaa82"/>{go&&<path d="M134 53L145 62L135 67" fill="#dcaa82"/>}
 <path d="M101 49Q120  30 139 49L143 57H97Z" fill="#24364b"/><path d="M100 49H140V55H100Z" fill="#456285"/><path d="M103 55H139L147 61H103Z" fill="#17212c"/><circle cx="120" cy="46" r="3" fill="#d5b661"/>
 {stop?<><Hand x={60} y={69} rotate={-10}/><Hand x={180} y={69} rotate={10}/></>:go?<Hand x={75} y={54}/>:<><Hand x={82} y={39}/><Hand x={179} y={143} rotate={ 90}/></>}
 </>}
export function ManualGesture({n}){return <>
 <path d="M151 65Q155 55 171 55H218V207H143V 90Z" fill="#e2e8ec" stroke="#526371" strokeWidth="3"/><path d="M156  80H208V145H149Z" fill="#d8edf4" stroke="#72848f" strokeWidth="2"/>
 <path d="M168 142V176H203V129Q188 121 178 129Z" fill="#435c74"/><circle cx="183" cy="110" r="13" fill="#d2a27e"/><path d="M171 107Q169  90 185  90Q197 92 197 103L186 100L174 108Z" fill="#303b43"/>
 {line('M179 143L161 128',14,'#435c74')}{line(n===77?'M161 128H68':n===78?'M161 128H98V 70':'M161 128H98V179',10,'#d2a27e')}
 {n===77?<Hand x={66} y={128} rotate={-90}/>:n===78?<Hand x={98} y={69}/>:<Hand x={98} y={179} rotate={180}/>}
 <path d="M151 149H218V160H150Z" fill="#a6b5be"/><path d="M176 178H200" stroke="#5c7180" strokeWidth="4" strokeLinecap="round"/>
 </>}
export function SignalLight({n}){const active={83:0,84:1,85:2,86:0,87:1}[n],colors=['#eb2537','#ffc72a','#1aaf65'];return <>
 <rect x=" 80" y="22" width=" 80" height="196" rx="20" fill="#17222c" stroke="#344654" strokeWidth="2"/><path d="M90 31V208" stroke="#41515e" strokeWidth="2" opacity=".8"/>
 {[0,1,2].map(i=><g key={i}><path d={`M88 ${43+i*61}Q120 ${18+i*61}152 ${43+i*61}V${51+i*61}Q120 ${34+i*61}88 ${51+i*61}Z`} fill="#090f14"/><circle cx="120" cy={ 60+i*61} r="24" fill={i===active?colors[i]:'#2b3943'} stroke="#0a1117" strokeWidth="3"/><path d={`M106 ${49+i*61}Q120 ${40+i*61}134 ${49+i*61}`} stroke={i===active?'white':'#455560'} strokeWidth="3" opacity={i===active?'.45':'.3'} fill="none" strokeLinecap="round"/></g>)}
 {n>85&&<g stroke={active===0?colors[0]:'#c39000'} strokeWidth="3" strokeLinecap="round"><path d={`M 60 ${60+active*61}H45M180 ${60+active*61}H195M66 ${40+active*61}L55 ${32+active*61}M174 ${40+active*61}L185 ${32+active*61}`} /></g>}
 </>}
