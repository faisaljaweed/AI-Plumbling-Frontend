import { NextResponse } from "next/server";
function sameOrigin(request: Request) {
 return request.headers.get("origin") === new URL(request.url).origin;
}
export const dynamic="force-dynamic";
async function forward(request: Request, context: {params:Promise<{path:string[]}>}) {
 if(!["GET","HEAD"].includes(request.method) && !sameOrigin(request)) return NextResponse.json({success:false,message:"Invalid request origin."},{status:403});
 const {path}=await context.params;
 const relative=path.join("/");
 if(!/^(leads|chat|bookings|availability|analytics|businesses)(\/[a-zA-Z0-9_-]+)*$/.test(relative)) return NextResponse.json({message:"Not found"},{status:404});
 const publicRoute=(request.method==="POST" && relative==="leads") || (request.method==="GET" && relative==="availability") || relative==="chat" || relative==="chat/start" || /^chat\/\d+$/.test(relative) || (request.method==="POST" && relative==="bookings");
 const workspaceRequest=!publicRoute || (relative==="availability" && new URL(request.url).searchParams.get("workspace")==="1");
 const base=process.env.API_BASE_URL;
 if(!base || (workspaceRequest && !process.env.API_ADMIN_KEY)) return NextResponse.json({success:false,message:"Backend connection is not configured."},{status:503});
 const url=new URL(`${base.replace(/\/$/,"")}/api/${relative}`);
 url.search=new URL(request.url).search;
 const headers=new Headers({"Content-Type":"application/json"});
 if(workspaceRequest) headers.set("Authorization",`Bearer ${process.env.API_ADMIN_KEY}`);
 else if(request.headers.get("authorization")) headers.set("Authorization",request.headers.get("authorization")!);
 try {
  const body=["GET","HEAD"].includes(request.method)?undefined:await request.text();
  if(body && body.length>16000) return NextResponse.json({message:"Request too large."},{status:413});
  const result=await fetch(url,{method:request.method,headers,body,cache:"no-store",signal:AbortSignal.timeout(30000),redirect:"error"});
  return new Response(await result.text(),{status:result.status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
 }catch{return NextResponse.json({success:false,message:"Cannot reach the service. Please try again shortly."},{status:502});}
}
export {forward as GET,forward as POST,forward as PATCH,forward as DELETE};
