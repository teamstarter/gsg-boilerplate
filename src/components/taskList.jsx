import React, { useEffect } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client'

import TaskElement from './taskElement'

const GET_TASKS = gql`
  query GetTasks($order: String, $where: SequelizeJSON) {
    task(order: $order, where: $where) {
      id
      name
      active
    }
  }
`

const TASK_ADDED = gql`
  subscription OnTaskAdded {
    taskCreated {
      id
      name
      active
    }
  }
`

const TASK_DELETED = gql`
  subscription OnTaskDeleted {
    taskDeleted {
      id
      name
      active
    }
  }
`

export default function TaskList({ status }) {
  function isActive(status) {
    if (status === 'active') return true
    else if (status === 'completed') return false
    else return undefined
  }

  const { loading, error, data, refetch } = useQuery(GET_TASKS, {
    variables: {
      order: 'reverse:createdAt',
      where: {
        active: isActive(status)
      }
    }
  })

  useEffect(() => {
    refetch()
  }, [refetch, status])

  useSubscription(TASK_ADDED, {
    onSubscriptionData: () => {
      refetch()
    }
  })

  useSubscription(TASK_DELETED, {
    onSubscriptionData: () => {
      refetch()
    }
  })

  if (loading) return <p>Loading ...</p>

  if (error) return <p>An error occured while loading the tasks !</p>

  return (
    <ul id="todos" className="todos" aria-label="List of to do tasks">
      {data.task.map(task => (
        <TaskElement task={task} key={task.id} reloadList={refetch} />
      ))}
    </ul>
  )
}
