
import getCurrentUser from '@/src/redux/actions/getCurrentUser';
import NavbarContent from './NavbarContent';
const Navbar = async () => {
  const currentUser = await getCurrentUser();

  console.log("user image", currentUser?.image);

  return (
    <NavbarContent currentUser={currentUser} />
  )
}

export default Navbar
