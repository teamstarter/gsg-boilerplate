import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { useDebouncedCallback } from 'use-debounce'

export default function TaskElement({ task, reloadList }) {
  const UPDATE_TASK = gql`
    mutation UpdateTask($task: taskInput!) {
      taskUpdate(task: $task) {
        id
        name
        active
      }
    }
  `
  const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
      taskDelete(id: $id)
    }
  `

  const { id, name, active } = task

  const [taskUpdate] = useMutation(UPDATE_TASK)

  const [taskDelete] = useMutation(DELETE_TASK)

  async function handleCheck(e) {
    await taskUpdate({
      variables: {
        task: { id: id, active: !e.currentTarget.checked }
      }
    })
    reloadList()
  }

  function handleDelete(e) {
    taskDelete({
      variables: {
        id: id
      }
    })
  }

  const { callback: debouncedHandleUpdate } = useDebouncedCallback(value => {
    taskUpdate({
      variables: {
        task: { id: id, name: value }
      }
    })
  }, 1000)

  return (
    <li className="todo">
      <div className="pretty p-icon p-round">
        <input
          type="checkbox"
          className="checkbox"
          checked={!active}
          onChange={handleCheck}
        />
        <div className="state">
          <i className="icon mdi mdi-check mdi-18px"></i>
          <label></label>
        </div>
      </div>
      <input
        className={`todo-text ${!active && 'todo-checked-text'}`}
        onChange={e => debouncedHandleUpdate(e.currentTarget.value)}
        defaultValue={name}
      ></input>
      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
