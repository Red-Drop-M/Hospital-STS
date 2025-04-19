import { Button } from "@/components/ui/button"
import { Menu, Droplet } from "lucide-react"
import Admin from "./admin/page"
import Notification from "./notification/page"
import Profile from "./profile/page"

const Header = () => {
  return (
    <>
        <div className="flex items-center gap-2 p-2">
          <Droplet className="h-8 w-8 size-1 bg-red-900 text-white rounded-full p-1" />
          <span className="text-lg font-semibold tracking-tight">Red Drop</span>
        </div>

        <div className="flex flex-1 justify-end items-center gap-4 pr-2">
            <Notification /> 
            <Profile />
            <Admin />
        </div>
    </>
  )
}

export default Header