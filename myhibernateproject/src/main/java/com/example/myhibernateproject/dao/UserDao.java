package com.example.myhibernateproject.dao;

import org.hibernate.Session;
import org.hibernate.query.Query;

import com.example.myhibernateproject.entity.Profile;
import com.example.myhibernateproject.entity.User;
import com.example.myhibernateproject.util.HibernateUtil;
import java.util.List;

public class UserDao {

	

	@SuppressWarnings("deprecation")
	public void deleteUser(long id) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		User u = session.get(User.class, id);
		Profile p=u.getProfile();
		session.delete(u);
		session.delete(p);
		session.getTransaction().commit();
		session.close();
		System.out.println("Student account has been deleted successfully");
	}

	
	public List<User> getAllUsers() {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Query<User> query = session.createQuery("from Student", User.class);
		List<User> s_list = query.list();
		session.getTransaction().commit();
		session.close();
		return s_list;
	}
	
	

}
