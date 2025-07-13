package com.example.myhibernateproject.dao;

import org.hibernate.Session;
import com.example.myhibernateproject.entity.User;
import com.example.myhibernateproject.util.HibernateUtil;

public class ProfileDao {
	@SuppressWarnings("deprecation")
	public void updateProfile(long uId, String name, int age, String mob_no, String branch, String address) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		User u = session.get(User.class, uId);
		u.getProfile().setName(name);
		u.getProfile().setAge(age);
		u.getProfile().setMob_no(mob_no);
		u.getProfile().setBranch(branch);
		u.getProfile().setAddress(address);
		u.setName(name);
		session.saveOrUpdate(u);
		session.getTransaction().commit();
		session.close();
		System.out.println("Profile updated successfully");
	}

	public void viewProfile(long userId) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		User u = session.get(User.class, userId);
		if (u.isEducator())
			System.out.println(u.getProfile().displayEducatorProfile());
		else
			System.out.println(u.getProfile());
		session.getTransaction().commit();
		session.close();
	}
}
