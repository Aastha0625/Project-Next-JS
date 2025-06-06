import withAuth from "next-auth/middleware";
import { NextResponse ,NextRequest} from "next/server";


export default withAuth(
    function middleware(){
        return NextResponse.next();
      },  //every middleware has a next
        //middleware processes every request, but ye wihtAuth me sath me ek aur object 
        // jo callbacks deta h bhi pass hoga
        //authorized callbacks h
       {
        callbacks: {
            authorized : ({token, req}) =>{
                const {pathname} = req.nextUrl;

                //allow auth related routes
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ){
                    return true; //middleware tbhi invoke hoga jab ye true hoga
                }

                //for public paths
                if(pathname === "/" || pathname.startsWith("/api/videos")){
                    return true
                }
                return !!token
            }
        }
    }
)

//kaha kaha pe middleware run hona chahiye
export const config = {
    matcher : ["/((?!_next/static|_next/image|favicon.ico|public/).*)"]
}