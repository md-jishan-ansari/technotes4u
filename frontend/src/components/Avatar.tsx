import Image from "next/image";
import { BsPersonFill } from "react-icons/bs";

interface AvatarProps {
    image?: string | null | undefined;
    size?: number;
}

const Avatar: React.FC<AvatarProps> = ({image, size = 24}) => {
  return (
    image ? (
            <div className="border w-fit rounded-full text-white">
                <Image
                    src={image}
                    alt="avatar"
                    width={size}
                    height={size}
                    className="rounded-full"
                />
            </div>
        ) : (
            <div className="bg-slate-900 dark:bg-slate-700  w-fit  rounded-full p-1 text-white"><BsPersonFill size={size-6} /></div>
        )
  )
}

export default Avatar
