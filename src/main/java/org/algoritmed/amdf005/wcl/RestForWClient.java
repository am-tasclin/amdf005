package org.algoritmed.amdf005.wcl;

import java.util.HashMap;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.reactive.function.client.WebClient;

public class RestForWClient {
	@GetMapping("/v/f1")
	public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
		model.addAttribute("name", name);
		WebClient client1 = WebClient.create();
		HashMap<Object, Object> hashMap = new HashMap<>();
		
		return "v/f1";
	}
}
