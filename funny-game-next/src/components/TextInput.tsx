
import React from 'react'

export default function TextInput(){
  return (
    <form className="input-field">
      <input type="text" placeholder="Type your message here..." />
      <button type="submit">Send</button>
    </form>
  )
}
