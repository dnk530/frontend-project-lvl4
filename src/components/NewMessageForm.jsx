import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/index.js';
import socket from '../utils/socket.js';

function NewMessageForm() {
  const auth = useAuth();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const f = useFormik({
    initialValues: { text: '' },
    onSubmit: (values) => {
      const { text } = values;
      const { username } = auth;
      const channelId = currentChannelId;
      const newPromise = new Promise((resolve) => {
        const message = {
          text,
          username,
          channelId,
          timestamp: Date.now(),
        };
        socket.emit('newMessage', message, (res) => {
          if (res.status === 'ok') {
            f.resetForm();
            resolve();
          }
        });
      });
      return newPromise;
    },
  });

  return (
    <Form onSubmit={f.handleSubmit}>
      <Form.Group className="d-flex">
        <Form.Control
          type="text"
          name="text"
          aria-label="New message"
          placeholder="Enter your message..."
          value={f.values.text}
          onChange={f.handleChange}
        />
        <Button type="submit" className="mx-2" disabled={f.isSubmitting}>
          Send
        </Button>
      </Form.Group>
    </Form>
  );
}

export default NewMessageForm;