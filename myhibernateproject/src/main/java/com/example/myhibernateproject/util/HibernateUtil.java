package com.example.myhibernateproject.util;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import com.example.myhibernateproject.entity.Course;
import com.example.myhibernateproject.entity.Lecture;
import com.example.myhibernateproject.entity.Profile;
import com.example.myhibernateproject.entity.User;

public class HibernateUtil {
    private static SessionFactory factory=buildFactory();

    private static SessionFactory buildFactory() {
    	Configuration cfg=new Configuration();
    	cfg.configure("hibernate.cfg.xml")
    	.addAnnotatedClass(User.class)
    	.addAnnotatedClass(Course.class)
    	.addAnnotatedClass(Profile.class)
    	.addAnnotatedClass(Lecture.class);
    	return cfg.buildSessionFactory();
    }
    public static SessionFactory getSessionFactory() {
    	return factory;
    }
    
}
