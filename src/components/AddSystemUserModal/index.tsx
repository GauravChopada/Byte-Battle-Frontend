'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { networkEndpoints } from '@/utils/constants/networkEndpoints'
import { systemUsersArray, systemUsers } from '@/utils/constants/common'
import { useAuth } from '@/context/auth'
import Button from '@/components/Button'
import CloseIcon from '@/utils/Icons/Close'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import networkClient, { NetworkClientInputs } from '@/network/networkClient'
import Select from '@/components/Select'
import styles from './AddSystemUserModal.module.scss'

type Props = {
  open?: boolean
  onClose: () => void
  refetchUsers: () => void
}

const AddSystemUserModal = ({ open = false, onClose, refetchUsers }: Props) => {
  const initialUserData = {
    firstName: '',
    lastName: '',
    email: '',
    role: systemUsers.challenger
  }

  const initialErrorState = {
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  }

  const { user } = useAuth()
  const [userData, setUserData] = useState(initialUserData)
  const [errorState, setErrorState] = useState(initialErrorState)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isSelectDisabled, setIsSelectDisabled] = useState(false)

  // handles value change of input fields
  const onInputChange = (key: string, value: string | string[]) => {
    if (value) {
      setErrorState({ ...errorState, [key]: '' })
    }
    setUserData({ ...userData, [key]: value })
  }

  // checks if email is valid
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email)
  }

  // handles onBlur event of input fields
  const onFocusLost = (key: string, value: string) => {
    if (!value) {
      setErrorState({ ...errorState, [key]: 'This field is required' })
      return
    }

    if (key === 'email' && !isValidEmail(value)) {
      setErrorState({ ...errorState, [key]: 'Invalid email' })
      return
    }
  }

  // handles submit event of form
  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      return
    }

    const networkParams = {
      ...networkEndpoints.user.create,
      body: userData
    } as NetworkClientInputs

    const response = await networkClient(networkParams)

    if (response?.status === 201) {
      toast.success('User created successfully')
      refetchUsers()
      onClose()
      setUserData(initialUserData)
      setErrorState(initialErrorState)
    } else {
      console.error(response)
      toast.error('Something went wrong')
    }
  }

  // based on current user's role, disable the role selection field if needed
  useEffect(() => {
    if (user?.role === systemUsers.challenger) {
      setIsSelectDisabled(true)
      return
    }
    setIsSelectDisabled(false)
  }, [user?.role])

  // disable submit button if any error is present or any field is empty
  useEffect(() => {
    const hasError = Object.values(errorState).some(item => Boolean(item))
    const hasEmptyField = Object.values(userData).some(item => !Boolean(item))
    const invalidEmail = !isValidEmail(userData.email)
    setIsSubmitDisabled(hasError || hasEmptyField || invalidEmail)
  }, [userData, errorState])

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.AddSystemUserModal}>

        {/* Top Bar */}
        <section className={styles.AddSystemUserModal__TopBar}>
          <h1 className={styles.AddSystemUserModal__Title}>Add User</h1>
          <CloseIcon className={styles.AddSystemUserModal__CloseIcon} onClick={onClose}/>
        </section>

        {/* Form */}
        <section className={styles.AddSystemUserModal__Form}>
          <div className={styles.AddSystemUserModal__FormRow}>
            <Input
              label='First name*'
              value={userData.firstName}
              onChange={(newValue) => onInputChange('firstName', newValue)}
              onFocusLost={(newValue) => onFocusLost('firstName', newValue)}
              isError={Boolean(errorState?.firstName)}
              helperText={errorState?.firstName} />

            <Input
              label='Last name*'
              value={userData.lastName}
              onChange={(newValue) => onInputChange('lastName', newValue)}
              onFocusLost={(newValue) => onFocusLost('lastName', newValue)}
              isError={Boolean(errorState?.lastName)}
              helperText={errorState?.lastName} />
          </div>

          <Input
            label='Email*'
            placeholder='example@email.com'
            value={userData.email}
            onChange={(newValue) => onInputChange('email', newValue)}
            onFocusLost={(newValue) => onFocusLost('email', newValue)}
            isError={Boolean(errorState?.email)}
            helperText={errorState?.email} />

          <Select
            label='Select Role*'
            disabled={isSelectDisabled}
            options={systemUsersArray}
            value={userData.role}
            onSelect={(newValue) => onInputChange('role', newValue)} />
        </section>

        {/* Bottom Bar */}
        <div className={styles.AddSystemUserModal__SubmitButton}>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddSystemUserModal
