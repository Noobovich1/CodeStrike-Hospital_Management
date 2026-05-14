package cswebapp.hospitalz.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String redirectToAuth() {
        return "redirect:/auth.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/index.html";
    }
}
