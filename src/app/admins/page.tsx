'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { networkEndpoints } from '../../../network/utils'
import { systemUsers, systemUsersArray } from '../../../utils/constants/common'
import { useAuth } from '../../../context/auth'
import AddSystemUserModal from '../../../components/AddSystemUserModal'
import Button from '../../../components/Button'
import CustomTable from "../../../components/CustomTable"
import LoadingSpinner from '../../../components/LoadingSpinner'
import networkClient, { NetworkClientInputs } from '../../../network/networkClient'
import plusSVG from '../../../utils/Icons/Plus.svg'
import SearchBar from '../../../components/SearchBar'
import styles from './admins.module.scss'
import { TableCellTypes } from '../../../components/CustomTable/TableCell'

const AdminsPage = () => {
  // init
  const { user } = useAuth() 
  const [searchBarValue, setSearchBarValue] = useState('')
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [originalTableData, setOriginalTableData] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])

  // delete user using user id.
  const deleteUser = async (id: string) => {
    try {
      // set loading state
      setTableData(tableData.map((user: any) => {
        if (user.id?.value === id) {
          return { ...user, action: { ...user.action, isLoading: true } }
        }
        return user
      }))

      const networkParams = {
        method: networkEndpoints.user.delete.method,
        endpoint: `${networkEndpoints.user.delete.endpoint}/${id}`,
      } as NetworkClientInputs
      
      const response = await networkClient(networkParams)

      if (response?.status === 204) {
        // remove user entry locally
        setTableData(tableData.filter((user: any) => user.id.value !== id))
        toast.success('User deleted successfully')
      } else {
        console.error(response)
        toast.error('Something went wrong')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    }
  }

  const changeUserRole = async (newRole: string, id: string) => {
    try {
      // set loading state
      setTableData(tableData.map((user: any) => {
        if (user.id.value === id) {
          return { ...user, role: { ...user.role, isLoading: true } }
        }
        return user
      }))

      const networkParams = {
        method: networkEndpoints.user.update.method,
        endpoint: `${networkEndpoints.user.update.endpoint}/${id}`,
        body: { role: newRole }
      } as NetworkClientInputs
      
      const response = await networkClient(networkParams)

      if (response?.status === 200) {
        // update role locally and update the loading state
        const updatedTableData = tableData.map((user: any) => {
          if (user.id.value === id) {
            return { ...user, role: { value: newRole, isDisabled: newRole === systemUsers.admin ,isLoading: false } }
          }
          return user
        })
        setOriginalTableData(updatedTableData)
        setTableData(updatedTableData)
        toast.success('User updated successfully')
      } else {
        // update loading state
        setTableData(tableData.map((user: any) => {
          if (user.id.value === id) {
            return { ...user, role: { ...user.role, isLoading: false} }
          }
          return user
        }))
        console.error(response)
        toast.error(response?.data.description ?? 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    }
  }

  const tableColumns = [
    {
      name: 'Name',
      key: 'name',
      type: TableCellTypes.TEXT
    },
    {
      name: 'Email',
      key: 'email',
      type: TableCellTypes.TEXT
    },
    {
      name: 'Role',
      key: 'role',
      type: TableCellTypes.SELECT,
      options: systemUsersArray,
      onSelect: (newValue: string, userData: any) => changeUserRole(newValue, userData?.id.value)
    },
    {
      name: 'Actions',
      key: 'action',
      type: TableCellTypes.BUTTON,
      onClick: (userData: any) => deleteUser(userData?.id.value)
    }
  ]

  // filter table data based on search bar value
  const onSearchBarValueChange = (newValue: string) => { 
    setSearchBarValue(newValue)
    const tempTableData = originalTableData.filter((user: any) => user.name.value.toLowerCase().includes(newValue.toLowerCase()) || user.email.value.toLowerCase().includes(newValue.toLowerCase()) || user.role.value.toLowerCase().includes(newValue.toLowerCase()))
    setTableData(tempTableData)
  }

  // close add user modal
  const closeAddUserModal = () => { setIsAddUserModalOpen(false) }

  // fetch users data
  const fetchUsers = () => {
    const networkParams = { ...networkEndpoints.user.getAll } as NetworkClientInputs

    networkClient(networkParams).then((response) => {
      setIsLoading(false)

      if (response?.status === 200) {
        // transform data to match table requirements
        const tableData = response.data.item.map((item: any) => {
          const transformedItem: Record<string, unknown> = {
            name: { value: `${item.firstName} ${item.lastName}` },
            action: { value: 'Remove',
            isDisabled: item.email.toLowerCase() === user?.email?.toLowerCase() || item.role === systemUsers.admin }
          };
          Object.keys(item).forEach((key) => {
            transformedItem[key] = { 
              value: item[key],
              isDisabled: item.email.toLowerCase() === user?.email?.toLowerCase() || item.role === systemUsers.admin,
             };
          });
          return transformedItem;
        })

        setOriginalTableData(tableData)
        setTableData(tableData)
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setOriginalTableData([])
      setTableData([])
      setIsLoading(false)
      console.error(err)
      toast.error('Something went wrong')
    })
  }

  // fetch users data on page load
  useEffect(() => {
    fetchUsers()
  }, [])

  return <main className={styles.Admins}>
    <section className={styles.Admins__TopBar}>
      <div className={styles.Admins__ContentInfo}>
        <h1>System Users</h1>
        <h3>View all system users</h3>
        <SearchBar value={searchBarValue} onChange={onSearchBarValueChange} />
      </div>
      <Button onClick={() => { setIsAddUserModalOpen(true) }} icon={plusSVG}>Add System User</Button>
    </section>

    <section className={styles.Admins__TableContainer}>
      {/* show loading spinner while data is fetching */}
      {isLoading && <div className={styles.Admins__LoadingSpinner}>
        <LoadingSpinner />
      </div>}

      {/* render users data in table once API responds */}
      {!isLoading && <CustomTable columns={tableColumns} content={tableData} noDataMessage='No User data Found !!'/>}
    </section>

    {/* Add New User Modal */}
    <AddSystemUserModal open={isAddUserModalOpen} onClose={closeAddUserModal} refetchUsers={fetchUsers}/>
  </main>
}

export default AdminsPage
