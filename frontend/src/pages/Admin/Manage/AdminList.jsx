import React, {useState, useEffect} from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link } from 'react-router-dom'
import axios from 'axios'

export const AdminList = () => {

  const [assignVisible, setAssignVisible] = useState(false);
  const [updateRoleVisible, setUpdateRoleVisible] = useState(false);
  
  const [adminlist, setAdminlist] = useState([]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:5000/manage/admin');
        setAdminlist(response.data);

        console.log(response.data)
      } catch(err) {
          console.error('Error fetching users:', err);
      }
    }
    fetchAdmin();
  }, []);


  const handleAssignAdmin = () => {
    setAssignVisible(!assignVisible)
    setUpdateRoleVisible(false)
  }

  const handleUpdateRole = (event) => {
    setUpdateRoleVisible(!updateRoleVisible)
    setAssignVisible(false)

    event.target.getAttribute('key')
    console.log(event.target.getAttribute('key'))
  }



  return (
    <div className='relative flex flex-col h-screen overflow-hidden'>
        <div className='grid grid-cols-[20%_80%]'> 
            <AdminSideBar />
            <div className='relative flex flex-col items-center p-10 min-h-screen gap-10 mx-auto overflow-y-scroll'>
                <div className='flex w-full items-center justify-between pb-2 border-b-1 border-b-[#2F2F2F]'>
                    <label className='text-[26px] font-bold text-[#2F2F2F]'>Admin List</label>
                    <button onClick={handleAssignAdmin} className={!assignVisible ? 'flex items-center bg-[#B5C04A] active:bg-[#CFDA34] p-2 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px] cursor-pointer' : 'hidden'}> Assign New Admin</button>
                </div>

                <table className='flex flex-col w-full gap-2'>
                  <thead className='flex w-full'>
                    <tr className='grid grid-cols-5 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Last Login</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody className='flex flex-col w-full'>
                    {adminlist.map((admin) => (
                      <tr key={admin.user_id} className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                        <td>{admin.user_id}</td>
                        <td>{`${admin.firstname} ${admin.lastname}`}</td>
                        <td>{admin.email}</td>
                        <td>{admin.last_login}</td>
                        <td>
                          {updateRoleVisible ? (
                            <>
                            <button onClick={() => handleUpdateRole('key')} disabled className='bg-[#cccccc] text-[#a3a3a3] font-bold p-1 pl-4 pr-4 rounded-[15px] cursor-disabled'>Updating...</button>
                            </>
                          ) : 
                          <button onClick={() => handleUpdateRole('key')} className='bg-[#cccccc] active:bg-[#a3a3a3] text-[#2F2F2F] font-bold p-1 pl-4 pr-4 rounded-[15px] cursor-pointer'>Update Role</button>}
                        </td>
                      </tr> 
                    ))}
                  </tbody>
                </table>

                {assignVisible && (
                  <>
                  <div className='absolute bottom-0 flex flex-col w-full gap-5 bg-[#FFF] p-5 rounded-tr-[15px] rounded-tl-[15px] m-10 border-t-2 border-t-[#2F2F2F] border-r-2 border-r-[#2F2F2F] border-l-2 border-l-[#2F2F2F]'>
                    <div className='flex flex-col w-full gap-3 pb-3 border-b-2 border-b-[#595959]'>
                      <div className='flex justify-between w-full'>
                        <label className='self-start text-[18px] text-[#2F2F2F] font-bold'>Assign new admin</label>
                        <button onClick={handleAssignAdmin} className='cursor-pointer'>Close</button>
                      </div>
                      <div className='flex items-center justify-between w-full fit-content gap-4'>
                        <label className='flex text-[#595959] text-[16px]'>Search for a new candidate</label>
                        <input type="search" name="" id="" placeholder="Type the users name" className='flex-3 p-2 border-1 border-[#a3a3a3] rounded-[15px]'/>
                        <button className='flex p-2 pl-3 pr-3 bg-[#2F2F2F] active:bg-[#595959] text-[#FFF] rounded-[15px] cursor-pointer'>Search</button>
                      </div>
                    </div>

                    <div className='flex justify-between w-full gap-4'>
                      <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Name</label>
                        <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>Angelo Cabangal</label>
                      </div>
                      <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Email</label>
                        <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>EmailAddress@gmail.com</label>
                      </div>
                      <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Role</label>
                        <select name="" id="" className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>
                          <option value="regular">Basic</option>
                          <option value="head_volunteer">Head Volunteer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className='flex w-full justify-end'>
                      <button className='bg-[#B5C04A] active:bg-[#CFDA34] p-2 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px] cursor-pointer'>Save Changes</button>
                    </div>
                  </div>
                </>
                )}

                {updateRoleVisible && (
                  <>
                  <div className='absolute bottom-0 flex flex-col w-full  bg-[#FFF] gap-5 p-5 rounded-tr-[15px] rounded-tl-[15px] m-10 border-t-2 border-t-[#2F2F2F] border-r-2 border-r-[#2F2F2F] border-l-2 border-l-[#2F2F2F]'>
                    <div className='flex flex-col w-full gap-3 pb-3 border-b-1 border-b-[#595959]'>
                      <div className='flex justify-between w-full'>
                        <label className='self-start text-[24px] text-[#2F2F2F] font-bold'>Update Role</label>
                        <button onClick={handleUpdateRole} className='cursor-pointer'>Close</button>
                      </div>
                    </div>

                    <div className='flex justify-between w-full gap-4'>
                      <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Name</label>
                        <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>Angelo Cabangal</label>
                      </div>
                      <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Email</label>
                        <label className='p-2 border-1 border-[#CCCCCC] rounded-[10px] font-bold'>EmailAddress@gmail.com</label>
                      </div>
                      <div className='flex flex-col w-full justify-start'>
                        <label className='text-[#595959] text-[14px]'>Role</label>
                        <select name="" id="" className='p-2 border-1 border-[#DC8801] rounded-[10px] font-bold text-[#DC8801]'>
                          <option value="regular">Basic</option>
                          <option value="head_volunteer">Head Volunteer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className='flex w-full justify-end'>
                      <button className='bg-[#B5C04A] active:bg-[#CFDA34] p-2 pl-6 pr-6 text-[#FFF] font-bold rounded-[15px] cursor-pointer'>Save Changes</button>
                    </div>
                  </div>
                </>
                ) }
            </div>
        </div>
    </div>
  )
}

export default AdminList
