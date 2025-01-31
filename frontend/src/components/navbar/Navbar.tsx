
import getCurrentUser from '@/src/lib/actions/getCurrentUser';
import NavbarContent from './NavbarContent';
const Navbar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <NavbarContent currentUser={currentUser} />
  )
}

export default Navbar
