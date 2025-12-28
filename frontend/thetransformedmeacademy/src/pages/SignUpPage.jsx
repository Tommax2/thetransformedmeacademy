import React from 'react';
import {Link} from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader
} from 'lucide-react';
import {motion} from 'framer-motion';

const SignUpPage = () => {
  const loading = true;
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const handleChange = (e) => {
    e.preventDefaukt();
    console.log(formData);
  }
  return (
    <div>
      
      </div>
  )
}

export default SignUpPage