export interface Member {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Member' | 'Viewer'
}

let members: Member[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Member' },
  { id: '3', name: 'Peter Jones', email: 'peter@example.com', role: 'Viewer' },
]

const getAuthToken = (): string | null => {
  return 'dummy-auth-token'
}

const simulateApiResponse = <T>(data: T, error: string | null = null): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(new Error(error))
      } else {
        resolve(data)
      }
    }, 500)
  })
}

export const fetchMembers = async (): Promise<Member[]> => {
  const token = getAuthToken()
  if (!token) {
    return simulateApiResponse<Member[]>([], 'Unauthorized: No authentication token found')
  }
  console.log('Fetching members with token:', token)
  return simulateApiResponse(members)
}

export const addMember = async (newMember: Omit<Member, 'id'>): Promise<Member> => {
  const token = getAuthToken()
  if (!token) {
    return simulateApiResponse<Member>(
      null as unknown as Member,
      'Unauthorized: No authentication token found',
    )
  }
  console.log('Adding member with token:', token)
  return new Promise((resolve) => {
    setTimeout(() => {
      const member: Member = { ...newMember, id: String(members.length + 1) }
      members.push(member)
      resolve(member)
    }, 500)
  })
}

export const updateMember = async (updatedMember: Member): Promise<Member> => {
  const token = getAuthToken()
  if (!token) {
    return simulateApiResponse<Member>(
      null as unknown as Member,
      'Unauthorized: No authentication token found',
    )
  }
  console.log('Updating member with token:', token)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = members.findIndex((m) => m.id === updatedMember.id)
      if (index !== -1) {
        members[index] = updatedMember
        resolve(updatedMember)
      } else {
        reject(new Error('Member not found'))
      }
    }, 500)
  })
}

export const deleteMember = async (id: string): Promise<void> => {
  const token = getAuthToken()
  if (!token) {
    return simulateApiResponse<void>(
      undefined as void,
      'Unauthorized: No authentication token found',
    )
  }
  console.log('Deleting member with token:', token)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = members.length
      members = members.filter((member) => member.id !== id)
      if (members.length < initialLength) {
        resolve()
      } else {
        reject(new Error('Member not found'))
      }
    }, 500)
  })
}
