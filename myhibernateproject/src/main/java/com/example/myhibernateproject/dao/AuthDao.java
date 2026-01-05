package com.example.myhibernateproject.dao;



import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.hibernate.Session;
import org.hibernate.query.Query;

import com.example.myhibernateproject.entity.Profile;
import com.example.myhibernateproject.entity.User;
import com.example.myhibernateproject.util.HibernateUtil;

public class AuthDao {

	@SuppressWarnings({ "deprecation" })
	public User userSignup(String name, String email, String password,boolean isEducator) {
		if(name.length()<3) {
			System.out.println("There must be more than 2 character in name field");
			return null;
		}
		String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        if (!matcher.matches()) {
        	System.out.println("Invalid Email format");
        	return null;
        }
        if(password.length()<6) {
        	System.out.println("Password length must be greater than 5");
        	return null;
        }
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Query<User> query = session.createQuery("from User where email=:email", User.class);
		query.setParameter("email", email);
		User user = (User) query.uniqueResult();
		if (user != null) {
			String n=isEducator?"Educator":"User";
			System.out.println(n+" is already present for this email");
			session.getTransaction().commit();
			session.close();
			return null;
		}
		User u = new User();
		Profile p = new Profile();
		u.setEmail(email);
		u.setName(name);
		u.setPassword(password);
		u.setEducator(isEducator);
		p.setName(name);
		p.setEmail(email);
		p.setUser(u);
		u.setProfile(p);
		session.saveOrUpdate(u);
		session.getTransaction().commit();
		session.close();
		System.out.println("Successfully Sign up");
		return u;
	}

	public User userLogin(String email, String password,boolean isEducator) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Query<User> query = session.createQuery("from User where email=:email", User.class);
		query.setParameter("email", email);
		User user = (User) query.uniqueResult();
		if (user == null) {
			String n=isEducator?"Educator":"User";
			System.out.println(n+" not found");
			session.getTransaction().commit();
			session.close();
			return null;
		}
		if(isEducator!=user.isEducator()) {
			System.out.println("Invalid email id");
			session.getTransaction().commit();
			session.close();
			return null;
		}
		if (!user.getPassword().equals(password)) {
			System.out.println("Wrong password");
			session.getTransaction().commit();
			session.close();
			return null;
		}
		session.getTransaction().commit();
		session.close();
		System.out.println("Successfully Login");
		return user;
	}
	
	public boolean changePassword(String email, String oldPass, String newPass) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Query<User> query = session.createQuery("from User where email=:email", User.class);
		query.setParameter("email", email);
		User s = (User) query.uniqueResult();
		if (s == null) {
			System.out.println("Incorrect email");
			session.getTransaction().commit();
			session.close();
			return false;
		}
		if (!oldPass.equals(s.getPassword())) {
			System.out.println("Wrong password");
			session.getTransaction().commit();
			session.close();
			return false;
		}
		s.setPassword(newPass);
		session.getTransaction().commit();
		session.close();
		System.out.println("Password changed successfully");
		return true;
	}

}
