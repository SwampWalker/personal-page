package ca.tonita;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.logout.*;
import org.springframework.security.web.csrf.CsrfFilter;

import java.util.Objects;

/**
 * Created by Aaryn Tonita on 2016-08-14.
 * All rights reserved.
 */
@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest().permitAll()
                .and()
                .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
                .logout()
                .permitAll();
        http.addFilterAfter(getLogoutFilter(), CsrfFilter.class);
        Logger.getLogger(WebSecurity.class).info("Configured HttpSecurity.");
    }

    public LogoutFilter getLogoutFilter() {
        LogoutSuccessHandler successHandler = getLogoutSuccessHandler();
        LogoutHandler[] handlers = getLogoutHandlers();
        LogoutFilter filter = new LogoutFilter(successHandler, handlers);
        return filter;
    }

    public LogoutHandler[] getLogoutHandlers() {
        return new LogoutHandler[]{
                new SecurityContextLogoutHandler(),
                new CookieClearingLogoutHandler()
        };
    }

    public LogoutSuccessHandler getLogoutSuccessHandler() {
        SimpleUrlLogoutSuccessHandler handler = new SimpleUrlLogoutSuccessHandler();
        handler.setUseReferer(true);
        handler.setTargetUrlParameter("Referer");
        return handler;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("root").password("root").roles("ADMIN");
        Logger.getLogger(WebSecurity.class).info("Configured AuthenticationManagerBuilder.");
    }
}
