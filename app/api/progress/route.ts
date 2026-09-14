import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { learnerState } from "@/db/schema";

async function identity(){ const h=await headers(); return h.get("oai-authenticated-user-id")??"local-preview"; }
export async function GET(){try{const id=await identity();const [row]=await getDb().select().from(learnerState).where(eq(learnerState.userId,id)).limit(1);return Response.json({state:row?JSON.parse(row.stateJson):null})}catch{return Response.json({state:null,persistence:"unavailable"})}}
export async function POST(request:Request){try{const id=await identity();const stateJson=JSON.stringify(await request.json());await getDb().insert(learnerState).values({userId:id,stateJson}).onConflictDoUpdate({target:learnerState.userId,set:{stateJson,updatedAt:new Date().toISOString()}});return Response.json({saved:true})}catch{return Response.json({saved:false},{status:503})}}
