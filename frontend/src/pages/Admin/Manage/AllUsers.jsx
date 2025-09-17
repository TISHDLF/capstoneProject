import React, { useState, useEffect } from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link } from 'react-router-dom'
import axios from 'axios';

const AllUsers = () => {

  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/manage/users')
        setUsers(response.data);

        console.log(response.data)

      } catch(err) {
          console.error('Error fetching users:', err);
      }
    }
    fetchusers();
  }, []);

  const filteredItems = users.filter((all) => {
    return `${all.firstname} ${all.lastname} ${all.email} ${all.role}`
      .toLowerCase().includes(searchInput.toLowerCase())
  })  

  return (
    <div className='relative flex flex-col h-screen'>
        <div className='grid grid-cols-[20%_80%]'> 
            <AdminSideBar />
            <div className='flex flex-col items-center p-10 min-h-screen gap-5 mx-auto'>
                <div className='flex flex-row justify-start w-full border-b-2 border-b-[#525252]'>
                  <label className='font-bold text-[24px]'>Users & Head Volunteers</label>
                </div>

                {/* FILTERS */}
                <div className='flex flex-row justify-between w-full'>
                  <form className='flex w-full gap-2' onSubmit={(e) => {e.preventDefault()}}>
                    <input type="search" placeholder='Search' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                    className='bg-[#FFF] p-2 w-full border-1 border-[#595959] rounded-[15px]'/>
                    <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
                  </form>
                </div>

                <table className='flex flex-col gap-2 w-full'> 
                  <thead className='flex w-full'>
                    <tr className='grid grid-cols-[10%_20%_30%_30%_20%] w-full place-items-start bg-[#DC8801] text-[#FFF] rounded-[10px] p-3'>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className='flex flex-col w-full gap-1 overflow-y-scroll min-h-[550px]'>
                    {filteredItems.map((user) => (
                      <tr key={user.user_id} className='grid grid-cols-[10%_20%_30%_30%_20%] w-full place-items-center justify-items-start bg-[#FFF] text-[#2F2F2F] rounded-[10px] p-3 border-b-1 border-b-[#595959]'>
                        <td>{user.user_id}</td>
                        <td>{user.firstname + ' ' + user.lastname}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Link to={`/userprofile/${user.user_id}`} className='bg-[#2F2F2F] active:bg-[#595959] text-[#FFF] p-1 pl-4 pr-4 rounded-[15px] cursor-pointer'>View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default AllUsers