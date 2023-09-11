// import PropTypes from 'prop-types';
import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { nanoid } from 'nanoid';
import {
  ContactFormWrapper,
  ContactTitle,
  Button,
  FormWrapper,
  FormGroup,
  Label,
  ErrorText,
} from './ContactFormStyles';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';
import { useAddContactToFilterMutation } from 'redux/contactsApi';
import { addContact } from 'redux/contactSlice';

const phonebookSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
      'Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d`Artagnan'
    )
    .required('Name is required'),
  phone: Yup.string()
    .trim()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
      'Phone number must be digits and can contain spaces, dashes, parentheses and can start with +'
    )
    .required('Phone number is required'),
});

function ContactForm({ contacts }) {
  const initialValues = {
    name: '',
    phone: '',
  };

  const dispatch = useDispatch();
  const [addContactToFilter] = useAddContactToFilterMutation();

  const handleSubmit = async (values, actions) => {
    const { name, phone } = values;

    const isContactDuplicate = (name, phone) => {
      if (!contacts || !Array.isArray(contacts)) {
        return false;
      }

      return contacts.some(
        contact => contact.name === name || contact.phone === phone
      );
    };
    const isDuplicateContact = isContactDuplicate(name, phone);

    if (isDuplicateContact) {
      Notiflix.Notify.failure(
        'Contact with the same name or phone number already exists!',
        {
          position: 'center-top',
        }
      );
      return;
    }

    try {
      const response = await addContactToFilter({ name, phone });

      if (response.error) {
        Notiflix.Notify.failure('An error occurred while adding the contact.', {
          position: 'center-top',
        });
        return;
      }
      const newContact = { id: nanoid(), name, phone };
      dispatch(addContact(newContact));
      actions.resetForm();

      Notiflix.Notify.success('Contact added successfully!');
    } catch (error) {
      Notiflix.Notify.failure('An error occurred while adding the contact.', {
        position: 'center-top',
      });
    }
  };

  return (
    <ContactFormWrapper>
      <ContactTitle>Phonebook</ContactTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={phonebookSchema}
        onSubmit={handleSubmit}
      >
        <Form as={FormWrapper}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Field type="text" id="name" name="name" />
            <ErrorText name="name" component="div" className="error" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Phone</Label>
            <Field type="text" id="phone" name="phone" />
            <ErrorText name="phone" component="div" className="error" />
          </FormGroup>

          <Button type="submit">Add Contact</Button>
        </Form>
      </Formik>
    </ContactFormWrapper>
  );
}

// ContactForm.propTypes = {
//   contacts: PropTypes.array.isRequired,
// };

export default ContactForm;
